import { Server, Socket } from "socket.io";
import http from "http";
import classModel from "../models/class.model";
import pollModel from "../models/poll.model";
import { socketAuth } from "./socketAuth";
import { isOriginAllowed, allowedOrigins } from "../config/cors";

let io: Server;

// Store questions per class
const classQuestions = new Map<string, any[]>();

// Store active polls per class
const classPolls = new Map<string, any>();

// Store past polls per class in memory (and persist to DB)
const pastPolls = new Map<string, any[]>();

// Store active shared file (PDF slides) per class
const classActiveFiles = new Map<string, any>();


export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          console.warn("[Socket.IO CORS Blocked] origin:", origin, "Allowed:", allowedOrigins);
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // ---------------- JOIN CLASS ROOM ----------------
    socket.on("join_class_room", async ({ classId }) => {
      try {
        const user = socket.data.user;

        if (socket.rooms.has(classId)) {
          console.log(`User ${user._id} already in room ${classId}`);
          return;
        }

        const classObj = await classModel.findById(classId);
        if (!classObj) {
          return socket.emit("error", "Class not found");
        }

        const isInstructor = classObj.instructor.toString() === user._id.toString();
        const isParticipant = classObj.participants.some(
          (id) => id.toString() === user._id.toString()
        );

        if (!isInstructor && !isParticipant) {
          return socket.emit("error", "Not authorized");
        }

        if (!classObj.isLive) {
          return socket.emit("error", "Class not live");
        }

        socket.join(classId);
        socket.data.classId = classId;

        console.log(`User ${user._id} joined class ${classId}`);

        if (!classQuestions.has(classId)) {
          classQuestions.set(classId, []);
        }

        socket.emit("all_questions", classQuestions.get(classId));

        // If a file/slides is currently active, send to the joiner immediately
        if (classActiveFiles.has(classId)) {
          socket.emit("new_file_shared", classActiveFiles.get(classId));
        }

        // If a poll is currently active, send to the joiner immediately
        if (classPolls.has(classId)) {
          socket.emit("poll_launched", classPolls.get(classId));
        }

        socket.to(classId).emit("user_joined", {
          userId: user._id,
        });

        // Notify teacher that a student joined (for initial WebRTC setup)
        const isInstructorUser =
          (user.role || "").toString().trim().toLowerCase() === "instructor";
        if (!isInstructorUser) {
          socket.to(classId).emit("student_joined", {
            studentId: socket.id,
          });
        }
      } catch (err) {
        console.error("Join error:", err);
        socket.emit("error", "Internal server error");
      }
    });

    // ---------------- 📺 SCREEN SHARE & RENEGOTIATION ----------------

    socket.on("class_started", ({ classId }) => {
      socket.to(classId).emit("class_started");

      
    });

    // Students respond to 'request_renegotiation' by emitting this
    socket.on("renegotiate_ready", ({ to }) => {
      io.to(to).emit("student_joined", {
        studentId: socket.id,
      });
    });

    socket.on("class_stopped", ({ classId }) => {
      socket.to(classId).emit("class_stopped");
    });

    // ---------------- 🧠 WEBRTC SIGNALING ----------------

    socket.on("webrtc_offer", ({ to, offer }) => {
      io.to(to).emit("webrtc_offer", {
        offer,
        from: socket.id,
      });
    });

    socket.on("webrtc_answer", ({ to, answer }) => {
      io.to(to).emit("webrtc_answer", {
        answer,
        from: socket.id,
      });
    });

    socket.on("webrtc_ice_candidate", ({ to, candidate }) => {
      if (to) {
        io.to(to).emit("webrtc_ice_candidate", {
          candidate,
          from: socket.id,
        });
      }
    });
    
    // ---------------- 🎙️ MIC TOGGLE ----------------
    socket.on("mic_toggle", ({ classId, isMicOn }) => {
      socket.to(classId).emit("mic_toggle", { isMicOn });
    });

    // ---------------- QUESTIONS & CLASS MGMT ----------------

    socket.on("ask_question", ({ classId, question }) => {
      const user = socket.data.user;
      if (!classQuestions.has(classId)) return;
      const questions = classQuestions.get(classId)!;

      const newQuestion = {
        id: Date.now(),
        question,
        studentId: user._id,
        answer: null,
      };

      questions.push(newQuestion);
      io.to(classId).emit("new_question", newQuestion);
    });

    socket.on("answer_question", ({ classId, questionId, answer }) => {
      const user = socket.data.user;
      const isInstructorUser =
        (user.role || "").toString().trim().toLowerCase() === "instructor";
      if (!isInstructorUser) {
        return socket.emit("error", "Only instructor can answer");
      }

      const questions = classQuestions.get(classId);
      if (!questions) return;

      const updated = questions.map((q) =>
        q.id === questionId ? { ...q, answer } : q
      );

      classQuestions.set(classId, updated);
      io.to(classId).emit("question_answered", {
        questionId,
        answer,
      });
    });

    // ============= POLL EVENTS ============= fronm here
// ============= POLL EVENTS =============

/**
 * Teacher creates and launches a poll
 * - Broadcasts poll to all students in the class
 * - Sets auto-close timer (30 seconds by default)
 */
socket.on("create_poll", ({ classId, question, options, duration = 30 }) => {
  const user = socket.data.user;
  const isInstructorUser =
    (user.role || "").toString().trim().toLowerCase() === "instructor";

  if (!isInstructorUser) {
    return socket.emit("error", "Only instructors can create polls");
  }

  const newPoll = {
    id: Date.now(),
    question,
    options,
    responses: {},
    createdBy: user._id,
    isActive: true,
    createdAt: Date.now(),
    duration, // Duration in seconds
  };

  classPolls.set(classId, newPoll);
  io.to(classId).emit("poll_launched", newPoll);

  // AUTO-CLOSE POLL after duration
  setTimeout(() => {
    const poll = classPolls.get(classId);
    if (poll && poll.id === newPoll.id) {
      io.to(classId).emit("auto_close_poll", { classId, pollId: newPoll.id });
      handleClosePoll(classId, newPoll.id); // ✅ IMPORTANT
    }
  }, duration * 1000);
});

/**
 * Student submits a poll response
 * - Validates the student hasn't already voted
 * - Pushes response to array
 * - Broadcasts update to teacher for live stats
 */
socket.on("submit_poll_response", ({ classId, pollId, selectedOption }) => {
  const user = socket.data.user;
  const poll = classPolls.get(classId);

  if (!poll || poll.id !== pollId) {
    return socket.emit("error", "Poll not found or expired");
  }

  // CHECK IF USER ALREADY VOTED ACROSS ALL OPTIONS
  const alreadyVoted = Object.values(poll.responses).some((responses: any) =>
    Array.isArray(responses) &&
    responses.some((r: any) => r.userId?.toString() === user._id.toString())
  );

  if (alreadyVoted) {
    return socket.emit("error", "Already voted in this poll");
  }

  // SAFE TO PUSH - Store both userId and selected option
  if (!poll.responses[selectedOption]) {
    poll.responses[selectedOption] = [];
  }

  poll.responses[selectedOption].push({
    userId: user._id,
    timestamp: Date.now(),
  });

  // BROADCAST REAL-TIME UPDATE TO ALL (including teacher)
  io.to(classId).emit("poll_response_updated", {
    pollId,
    selectedOption,
    totalResponses: Object.values(poll.responses).flat().length,
    currentStats: generateStats(poll),
  });
});

/**
 * Teacher closes poll (manual or auto)
 * - Calculates final statistics
 * - Persists poll to database
 * - Broadcasts results to all users
 */
socket.on("close_poll", ({ classId, pollId }) => {
  const user = socket.data.user;
  const isInstructorUser =
    (user.role || "").toString().trim().toLowerCase() === "instructor";

  if (!isInstructorUser) {
    return socket.emit("error", "Only instructors can close polls");
  }

  handleClosePoll(classId, pollId);
});

/**
 * Helper function to close poll and calculate stats
 */
const handleClosePoll = (classId: string, pollId: number) => {
  const poll = classPolls.get(classId);

  if (!poll || poll.id !== pollId) {
    return;
  }

  poll.isActive = false;

  const stats = generateStats(poll);

  io.to(classId).emit("poll_closed", {
    pollId,
    statistics: stats,
    question: poll.question,
  });

  if (!pastPolls.has(classId)) {
    pastPolls.set(classId, []);
  }

  pastPolls.get(classId)?.push({
    question: poll.question,
    options: poll.options,
    responses: poll.responses,
    createdAt: poll.createdAt,
  });

  // Persist to MongoDB
  try {
    const flatResponses = Object.entries(poll.responses).flatMap(
      ([optIndex, resps]: [string, any]) =>
        (resps || []).map((r: any) => ({
          userId: r.userId,
          selectedOption: Number(optIndex),
        }))
    );

    pollModel
      .create({
        classId,
        question: poll.question,
        options: poll.options,
        responses: flatResponses,
        isActive: false,
        createdBy: poll.createdBy,
      })
      .catch((err) => console.error("Error saving poll to MongoDB:", err));
  } catch (err) {
    console.error("Poll save error:", err);
  }

  classPolls.delete(classId);
};
const generateStats = (poll: any) => {
  const total = Object.values(poll.responses).flat().length || 1;

  return poll.options.map((option: string, index: number) => ({
    option,
    count: poll.responses[index]?.length || 0,
    percentage: (
      ((poll.responses[index]?.length || 0) / total) * 100
    ).toFixed(1),
  }));
};
    socket.on("get_past_polls", async ({ classId }) => {
      try {
        const memPolls = pastPolls.get(classId) || [];
        if (memPolls.length > 0) {
          return socket.emit("past_polls", memPolls);
        }

        const dbPolls = await pollModel
          .find({ classId })
          .sort({ createdAt: -1 });

        const formatted = dbPolls.map((p) => {
          const responsesMap: Record<number, any[]> = {};
          p.responses.forEach((r) => {
            if (!responsesMap[r.selectedOption])
              responsesMap[r.selectedOption] = [];
            responsesMap[r.selectedOption].push({
              userId: r.userId.toString(),
              timestamp: (p.createdAt as any)?.getTime() || Date.now(),
            });
          });
          return {
            question: p.question,
            options: p.options,
            responses: responsesMap,
            createdAt: p.createdAt,
          };
        });

        socket.emit("past_polls", formatted);
      } catch (err) {
        socket.emit("past_polls", pastPolls.get(classId) || []);
      }
    });

    socket.on("end_class", async ({ classId }) => {
      try {
        const user = socket.data.user;
        const isInstructorUser =
          (user.role || "").toString().trim().toLowerCase() === "instructor";
        if (!isInstructorUser) {
          return socket.emit("error", "Only instructor can end class");
        }

        const classObj = await classModel.findById(classId);
        if (!classObj || classObj.instructor.toString() !== user._id.toString()) {
          return socket.emit("error", "Not authorized");
        }

        classObj.isLive = false;
        await classObj.save();

        io.to(classId).emit("class_ended", { classId });

        const sockets = await io.in(classId).fetchSockets();
        sockets.forEach((s) => {
          s.leave(classId);
          s.data.classId = null;
        });

        classQuestions.delete(classId);
        classActiveFiles.delete(classId);
        classPolls.delete(classId);
        console.log(`Class ${classId} ended`);
      } catch (err) {
        console.error("End class error:", err);
        socket.emit("error", "Internal server error");
      }
    });

    // ---------------- 📄 SLIDE SHARING & SYNCHRONIZATION ----------------
    socket.on("share_file", ({ classId, file }) => {
      const fileData = {
        ...file,
        page: file.page || 1,
      };
      classActiveFiles.set(classId, fileData);
      io.to(classId).emit("new_file_shared", fileData);
    });

    socket.on("slide_page_change", ({ classId, page }) => {
      const active = classActiveFiles.get(classId);
      if (active) {
        active.page = page;
        classActiveFiles.set(classId, active);
      }
      io.to(classId).emit("slide_page_changed", { page });
    });

    socket.on("stop_file_share", ({ classId }) => {
      classActiveFiles.delete(classId);
      io.to(classId).emit("file_share_stopped");
    });

    // ---------------- 🎨 WHITEBOARD COLLABORATION ----------------
    socket.on("whiteboard_draw", ({ classId, drawData }) => {
      socket.to(classId).emit("whiteboard_draw", drawData);
    });

    socket.on("whiteboard_clear", ({ classId }) => {
      socket.to(classId).emit("whiteboard_clear");
    });

    socket.on("disconnect", () => {
      const { user, classId } = socket.data;
      if (user && classId) {
        socket.to(classId).emit("user_left", {
          userId: user._id,
        });
      }
      console.log("Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};