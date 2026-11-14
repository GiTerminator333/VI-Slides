# 🎓 Vi-Slides — Next-Gen Interactive Classroom Platform

<div align="center">

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Real--Time_Media-333333?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Assistant-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <b>A comprehensive, real-time virtual classroom and learning management system bridging low-latency WebRTC streaming, collaborative canvas whiteboarding, instant polls, intelligent AI doubt assistance, and academic task workflows into a single unified workspace.</b>
</p>

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [API & Socket Reference](#-api--socket-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Installation & Running Locally](#installation--running-locally)
- [Challenges Faced and Solutions](#-challenges-faced-and-solutions)
- [Key Highlights](#-key-highlights)
- [Author](#-author)

---

## 🌟 Overview

**Vi-Slides** is engineered to overcome the fragmentation of modern online learning. Traditional setups force educators and students to juggle video-conferencing tools, separate whiteboard utilities, isolated LMS dashboards, and external messaging channels. 

Vi-Slides integrates synchronous learning (live screen sharing, WebRTC mesh audio, instant classroom polling, and interactive digital whiteboard) with asynchronous academic workflows (assignment submissions, grading, deadlined to-do tracking, and real-time reminders) alongside an integrated **Google Gemini AI** doubt resolution assistant.

---

## 🏗️ System Architecture

```
                               ┌──────────────────────────────────────────────────────────┐
                               │                    Client Application                    │
                               │           (React 19 + TypeScript + Vite + Tailwind)      │
                               └──────────────┬─────────────────────────────┬─────────────┘
                                              │                             │
                        HTTPS / REST (JWT Cookies)            WSS / Socket.IO Signaling & Events
                                              │                             │
                                              ▼                             ▼
                               ┌──────────────────────────────────────────────────────────┐
                               │                   Express.js Backend                     │
                               │                (TypeScript + Express 5)                  │
                               └──────┬───────────────────────┬────────────────────┬──────┘
                                      │                       │                    │
                             Mongoose Queries          Signaling Relay     Generative AI SDK
                                      │                       │                    │
                                      ▼                       ▼                    ▼
                             ┌─────────────────┐    ┌──────────────────┐  ┌──────────────────┐
                             │  MongoDB Atlas  │    │  WebRTC Mesh     │  │  Google Gemini   │
                             │  (Cloud Store)  │    │  (Audio/Screen)  │  │   AI Assistant   │
                             └─────────────────┘    └──────────────────┘  └──────────────────┘
```

---

## 🚀 Core Features

### 🎙️ 1. Live Classroom Sessions & WebRTC Streaming
- **Peer-to-Peer Audio & Screen Sharing**: Built with native browser `MediaStream` and WebRTC `RTCPeerConnection` signaling powered by Socket.IO.
- **Dynamic Track Renegotiation**: Seamlessly switch between screen share streams or toggle microphone tracks without severing the peer connection or dropping participant sessions.
- **Room Code Verification**: Instant 6-character cryptographically randomized session codes for fast student onboarding with strict instructor authorization.

### 🎨 2. Real-Time Collaborative Whiteboard
- **Vector Canvas Tools**: Pen, eraser, geometric shapes (rectangle, circle, straight lines, triangles, arrows) with custom stroke size and color pickers.
- **State Integrity & Undo/Redo**: Canvas snapshot stack preserving history across modifications.
- **Responsive Canvas Scaling**: Preserves canvas coordinate fidelity and redrawing buffers during window and viewport resizing.

### 📊 3. Interactive Live Polling
- **Instructor Launchpad**: Instructors can trigger timed multiple-choice polls with customizable durations (default 30 seconds).
- **Auto-Close & Real-Time Stats**: Automated countdown timers synchronize across participants; real-time response counters calculate vote percentages dynamically.
- **Past Poll History**: In-session archive allowing teachers and students to review prior questions and vote breakdowns.

### 🤖 4. Ask AI Doubt Resolution (Google Gemini)
- **Instant AI Teaching Assistant**: Direct integration with `@google/generative-ai` to parse student doubts and formulate structured, Markdown-formatted explanations.
- **Instructor Escalation Pipeline**: Student questions can be answered via AI or escalated to the live instructor queue for direct intervention.

### 📚 5. Academic Task & Assignment Management
- **Assignment Hub**: Create assignments with maximum marks, descriptions, and deadlines; students upload submissions with direct instructor grading and feedback.
- **Personalized To-Do System**: Integrated task planner categorized by priority, due dates, and completion status.
- **Notification Engine**: Real-time notification badge with automatic badge counts, deadline warnings, and unread trackers stored across local state.

### 🔐 6. Role-Based Access Control & Security
- **Strict Role Separation**: Tailored workflows and route guards for `Instructor` and `Student`.
- **JWT Authentication via HTTP-Only Cookies**: Secure session management preventing XSS access to tokens, fortified with bcrypt password hashing.

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component-driven, typed user interface |
| **Build Tool** | Vite 8 | Ultra-fast HMR and optimized production bundling |
| **Styling & UI** | Tailwind CSS v4 + Radix UI + Lucide Icons | Modern, accessible styling with custom design tokens |
| **Backend Runtime** | Node.js + Express 5 (TypeScript) | Scalable REST API & WebSocket server |
| **Database** | MongoDB Atlas via Mongoose 8 | Schema-based data modeling for users, classes, assignments, and tasks |
| **Real-Time Communication** | Socket.IO 4.8 | Low-latency bi-directional event messaging and signaling |
| **Streaming Protocol** | WebRTC + Google STUN | Peer-to-peer audio transmission and high-definition screen sharing |
| **Artificial Intelligence** | Google Gemini API (`@google/generative-ai`) | Real-time question answering and doubt clarification |
| **Security & Auth** | JSON Web Tokens (JWT) + Bcrypt | Stateless authentication with HTTP-only cookies and hashed credentials |

---

## 📂 Project Directory Structure

```text
Vi-Slides/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts               # MongoDB connection logic
│   │   │   └── gemini.ts           # Google Gemini Generative AI client
│   │   ├── controllers/
│   │   │   ├── ai.controller.ts    # AI doubt answering logic
│   │   │   ├── assignment.controller.ts # Assignment CRUD & submissions
│   │   │   ├── auth.controller.ts  # Signup, login, logout, profile update
│   │   │   ├── class.controller.ts # Live session lifecycle & code generation
│   │   │   └── todo.controller.ts  # Task & to-do management
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts  # JWT verification via cookies
│   │   │   └── role.middleware.ts  # Instructor / Student route authorization
│   │   ├── models/
│   │   │   ├── assignment.model.ts # Assignment & submission schema
│   │   │   ├── class.model.ts      # Classroom session schema
│   │   │   ├── poll.model.ts       # Poll questions & response schema
│   │   │   ├── todo.model.ts       # User todo tasks schema
│   │   │   └── user.model.ts       # User profile & credential schema
│   │   ├── routes/                 # Express route definitions
│   │   ├── socket/
│   │   │   ├── socket.ts           # Socket.IO room events, polls & WebRTC relay
│   │   │   └── socketAuth.ts       # Socket handshake authentication
│   │   └── index.ts                # Server entry point & CORS configuration
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── public/                     # Icons, static assets
│   ├── src/
│   │   ├── assets/                 # App logos, hero images
│   │   ├── components/             # Reusable UI components & modals
│   │   │   ├── ui/                 # Radix UI / Shadcn primitives
│   │   │   ├── NotificationBell.tsx# Real-time task & assignment alert dropdown
│   │   │   ├── PastPollsModal.tsx  # In-session poll review dialog
│   │   │   ├── PollModal.tsx       # Teacher poll creation modal
│   │   │   ├── question-sidebar.tsx# Live Q&A and AI response drawer
│   │   │   └── Whiteboard.tsx      # Canvas drawing engine
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Global user authentication context
│   │   ├── hooks/                  # Custom hooks (toast, mobile queries)
│   │   ├── lib/
│   │   │   ├── api.ts              # Axios HTTP client configuration
│   │   │   └── socket.ts           # Socket.IO singleton instance
│   │   ├── pages/
│   │   │   ├── SessionPage/        # Modularized live session components & hooks
│   │   │   │   ├── components/     # VideoDisplay, WhiteboardModal, PollContainer
│   │   │   │   └── hooks/          # WebRTC, Microphone & Socket manager hooks
│   │   │   ├── Dashboard.tsx       # Student & Teacher personalized dashboard
│   │   │   ├── SessionPage.tsx     # Fullscreen interactive classroom interface
│   │   │   ├── StudentAssignments.tsx
│   │   │   ├── TeacherAssignments.tsx
│   │   │   └── todo-page.tsx       # Interactive task management board
│   │   ├── App.tsx                 # Route router configuration
│   │   └── main.tsx                # Frontend entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```


## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance
- [Google Gemini API Key](https://aistudio.google.com/)

---

### Environment Configuration

#### Backend Setup (`Backend/.env`)
Create a `.env` file in the `Backend` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend Setup (`Frontend/.env`)
Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

### Installation & Running Locally

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/Vi-Slides.git
cd Vi-Slides
```

#### 2. Start the Backend Server
```bash
cd Backend
npm install
npm run dev
```
*The backend server will launch on `http://localhost:3000`.*

#### 3. Start the Frontend Client
In a new terminal window:
```bash
cd Frontend
npm install
npm run dev
```
*The frontend application will start on `http://localhost:5173`.*

---

## 🧗 Challenges Faced and Solutions

### 1. WebRTC Dynamic Renegotiation & Track Swapping
- **Challenge**: When the instructor started or stopped screen sharing during a live session, tearing down and recreating the entire `RTCPeerConnection` disrupted audio streams and caused significant connection latency.
- **Solution**: Implemented `RTCRtpSender.replaceTrack()` inside custom hook `useStreamManager`. The video track is hot-swapped dynamically without breaking the connection, falling back to a clean renegotiation cycle (`createOffer` -> `setLocalDescription`) only when a new stream is introduced.

### 2. DNS Resolution Failures with MongoDB SRV on Mobile Hotspots
- **Challenge**: On certain development networks and mobile hotspots (common in India with specific ISPs), Node's default DNS resolver fails to parse `mongodb+srv://` connection strings, triggering fatal `querySrv ECONNREFUSED` errors on startup.
- **Solution**: Explicitly configured Google DNS servers (`8.8.8.8`, `8.8.4.4`) at the entry point of the Node process using `dns.setServers()`, ensuring resilient database connectivity across any network environment.

### 3. Socket Concurrency & Race Conditions in Live Polls
- **Challenge**: Rapid polling submissions caused duplicate votes and state discrepancies when multiple students answered simultaneously within the short 30-second window.
- **Solution**: Designed atomic in-memory tracking via Map structures on the server with user ID deduplication prior to writing or broadcasting. An automated server-side timer triggers clean closure and persists the aggregate statistics before emitting the final state to all connected peers.

### 4. Canvas State Integrity During Dynamic Window Resizing
- **Challenge**: Responsive changes to window dimensions wiped out active HTML5 canvas drawing buffers, causing loss of drawings mid-lecture.
- **Solution**: Stored drawing states as serialized `ImageData` snapshots in memory. On window resize events, the canvas dimensions are recalibrated, and the buffer state is restored instantaneously via `putImageData` alongside an interactive undo/redo history stack.

### 5. Secure Cross-Origin Authentication with HTTP-Only Cookies
- **Challenge**: Managing credentials across distinct domains/ports (`localhost:5173` and `localhost:3000`) caused browser rejections of cookies due to CORS and `SameSite` constraints.
- **Solution**: Standardized Express CORS configuration to dynamically whitelist trusted origins while setting cookies with `httpOnly: true`, `secure: true`, and `sameSite: "none"`, paired with Axios `withCredentials: true` on all client requests.

---

## ✨ Key Highlights

- ⚡ **Hybrid Real-Time Architecture**: Combines low-overhead WebRTC peer-to-peer data flow for media transmission with Socket.IO for real-time signaling, polling, and interactive question feeds.
- 🧠 **Embedded GenAI Doubt Solver**: Directly incorporates the Gemini 1.5/2.0 API into the classroom sidebar, converting complex student questions into clean, structured Markdown explanations on the fly.
- 🎯 **All-in-One Educational Workspace**: Eliminates the need for multiple disparate apps by combining live video/audio, screen sharing, vector whiteboarding, instant polls, and assignment grading into a single dashboard.
- 🎨 **Modern, High-Performance UI**: Built on React 19, Vite, Tailwind CSS v4, and Radix UI primitives to ensure high responsiveness, fluid animations, and accessibility.

---

## 👨‍💻 Author

**Sushant**  
🎓 Computer Science & Engineering @ Delhi Technological University (DTU)  
- **Email**: [03sushant03@gmail.com](mailto:03sushant03@gmail.com)

---

<div align="center">
  <sub>Built with ❤️ for better, more interactive digital classrooms.</sub>
</div>
