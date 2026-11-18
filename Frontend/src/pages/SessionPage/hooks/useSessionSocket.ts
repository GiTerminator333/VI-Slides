import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";

export const useSessionSocket = ({
  classId,
  isTeacher,
  navigate,
  videoRef,
  peerConnections,
  pcRef,
  iceQueue,
  micStream,
  localStream,
  setSharedFile,
  slidePage,
  setSlidePage,
  setQuestions,
  setCurrentPoll,
  setPollStats,
  setHasVoted,
  setShowPollStats,
  setPastPolls,
  handleStreamStopped,
  currentPoll,
  onSessionEnded,
}: any) => {
  const currentPollRef = useRef(currentPoll);
  useEffect(() => {
    currentPollRef.current = currentPoll;
  }, [currentPoll]);

  useEffect(() => {
    if (!classId) return;

    const socket = getSocket();

    const rtcConfig = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const handleMicToggle = ({ isMicOn }: { isMicOn: boolean }) => {
      console.log("Mic state changed:", isMicOn);
    };

    const handleClassEnded = (data: { classId: string }) => {
      const incomingId = typeof data === "string" ? data : data?.classId;
      if (incomingId !== classId) return;

      if (isTeacher) handleStreamStopped();

      if (micStream.current) {
        micStream.current.getTracks().forEach((track: any) => track.stop());
        micStream.current = null;
      }

      onSessionEnded();
      socket.emit("leave_class_room", { classId });
      navigate("/dashboard");
    };

    const handleStudentJoined = async ({ studentId }: { studentId: string }) => {
      if (!isTeacher) return;

      const pc = new RTCPeerConnection(rtcConfig);
      peerConnections.current[studentId] = pc;

      if (micStream.current) {
        micStream.current.getAudioTracks().forEach((track: any) => {
          pc.addTrack(track, micStream.current!);
        });
      }

      if (localStream.current) {
        localStream.current.getTracks().forEach((track: any) => {
          const alreadyAdded = pc.getSenders().some((s: any) => s.track === track);
          if (!alreadyAdded) pc.addTrack(track, localStream.current!);
        });
      }

      pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", {
            to: studentId,
            candidate: event.candidate,
          });
        }
      };

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc_offer", { to: studentId, offer });
      } catch (err) {
        console.error("Error creating WebRTC offer for student:", err);
      }
    };

    const handleOffer = async ({ offer, from }: any) => {
      if (isTeacher) return;

      let pc = pcRef.current;

      if (!pc || pc.signalingState === "closed") {
        pc = new RTCPeerConnection(rtcConfig);
        pcRef.current = pc;

        pc.ontrack = (event: RTCTrackEvent) => {
          if (event.track.kind === "audio") {
            let audioEl = document.getElementById("teacher-audio") as HTMLAudioElement;

            if (!audioEl) {
              audioEl = document.createElement("audio");
              audioEl.id = "teacher-audio";
              document.body.appendChild(audioEl);
            }

            audioEl.srcObject = event.streams[0];
            audioEl.muted = true;

            audioEl.play().then(() => {
              setTimeout(() => {
                audioEl.muted = false;
              }, 500);
            }).catch(() => {});
          }

          if (event.track.kind === "video" && videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate) {
            socket.emit("webrtc_ice_candidate", { to: from, candidate: event.candidate });
          }
        };
      }

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        iceQueue.current.forEach((c: any) =>
          pc!.addIceCandidate(new RTCIceCandidate(c))
        );
        iceQueue.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc_answer", { to: from, answer });
      } catch (err) {
        console.error("Error answering WebRTC offer:", err);
      }
    };

    const handleAnswer = async ({ from, answer }: any) => {
      const pc = peerConnections.current[from];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error("Error setting remote description from answer:", err);
        }
      }
    };

    const handleIce = async ({ from, candidate }: any) => {
      const targetPc = isTeacher
        ? peerConnections.current[from]
        : pcRef.current;

      if (targetPc?.remoteDescription) {
        targetPc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
      } else if (!isTeacher) {
        iceQueue.current.push(candidate);
      }
    };

    const handleClassStopped = () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    const handleNewFile = (file: any) => {
      setSharedFile(file);
      if (file?.page && setSlidePage) {
        setSlidePage(file.page);
      }
    };

    const handleSlidePageChanged = ({ page }: { page: number }) => {
      if (setSlidePage) {
        setSlidePage(page);
      }
    };

    const handleFileShareStopped = () => {
      setSharedFile(null);
      if (setSlidePage) {
        setSlidePage(1);
      }
    };

    const handleAllQuestions = (data: any[]) => setQuestions(data || []);

    const handleNewQuestion = (q: any) => {
      setQuestions((prev: any[]) => {
        const qId = q.id || q._id;
        if (prev.some((existing) => (existing.id || existing._id) === qId))
          return prev;
        return [...prev, q];
      });
    };

    const handleQuestionAnswered = ({ questionId, answer }: any) => {
      setQuestions((prev: any[]) =>
        prev.map((q) => {
          const qId = q.id || q._id;
          return qId === questionId ? { ...q, answer } : q;
        })
      );
    };

    // ================= POLL HANDLERS =================
    const handlePollLaunched = (poll: any) => {
      setCurrentPoll(poll);
      setHasVoted(false);
      setPollStats(null);
      setShowPollStats(false);
    };

    const handlePollResponseUpdated = ({ currentStats, totalResponses }: any) => {
      if (isTeacher) {
        setPollStats({
          question: currentPollRef.current?.question,
          statistics: currentStats,
          totalResponses,
        });
      }
    };

    const handlePollClosed = ({ statistics, question }: any) => {
      setPollStats({
        question,
        statistics,
        totalResponses: (statistics || []).reduce(
          (sum: number, s: any) => sum + (s.count || 0),
          0
        ),
      });

      setShowPollStats(true);
      setCurrentPoll(null);
    };

    const handlePastPolls = (polls: any[]) => {
      setPastPolls(polls || []);
    };

    const handleUserLeft = ({ userId }: { userId: string }) => {
      console.log("User left session:", userId);
    };

    // Attach listeners
    socket.on("poll_launched", handlePollLaunched);
    socket.on("poll_response_updated", handlePollResponseUpdated);
    socket.on("poll_closed", handlePollClosed);
    socket.on("past_polls", handlePastPolls);
    socket.on("class_ended", handleClassEnded);
    socket.on("student_joined", handleStudentJoined);
    socket.on("webrtc_offer", handleOffer);
    socket.on("webrtc_answer", handleAnswer);
    socket.on("webrtc_ice_candidate", handleIce);
    socket.on("class_stopped", handleClassStopped);
    socket.on("new_file_shared", handleNewFile);
    socket.on("slide_page_changed", handleSlidePageChanged);
    socket.on("file_share_stopped", handleFileShareStopped);
    socket.on("all_questions", handleAllQuestions);
    socket.on("new_question", handleNewQuestion);
    socket.on("question_answered", handleQuestionAnswered);
    socket.on("mic_toggle", handleMicToggle);
    socket.on("user_left", handleUserLeft);

    const onConnect = () => {
      socket.emit("join_class_room", { classId });
    };

    if (socket.connected) onConnect();
    socket.on("connect", onConnect);

    // CLEANUP ONLY OWN LISTENERS (Do NOT wipe all socket listeners!)
    return () => {
      socket.off("poll_launched", handlePollLaunched);
      socket.off("poll_response_updated", handlePollResponseUpdated);
      socket.off("poll_closed", handlePollClosed);
      socket.off("past_polls", handlePastPolls);
      socket.off("class_ended", handleClassEnded);
      socket.off("student_joined", handleStudentJoined);
      socket.off("webrtc_offer", handleOffer);
      socket.off("webrtc_answer", handleAnswer);
      socket.off("webrtc_ice_candidate", handleIce);
      socket.off("class_stopped", handleClassStopped);
      socket.off("new_file_shared", handleNewFile);
      socket.off("slide_page_changed", handleSlidePageChanged);
      socket.off("file_share_stopped", handleFileShareStopped);
      socket.off("all_questions", handleAllQuestions);
      socket.off("new_question", handleNewQuestion);
      socket.off("question_answered", handleQuestionAnswered);
      socket.off("mic_toggle", handleMicToggle);
      socket.off("user_left", handleUserLeft);
      socket.off("connect", onConnect);
    };
  }, [classId, isTeacher]);
};
