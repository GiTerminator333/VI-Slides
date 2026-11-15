// ------------------- DNS FIX (for MongoDB on hotspot) -------------------
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ------------------- ENV CONFIG -------------------
import dotenv from "dotenv";

dotenv.config();

// ------------------- IMPORTS -------------------
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import assignmentRouter from "./routes/assignment.route";
import classRouter from "./routes/class.route";
import authRouter from "./routes/auth.route";
import aiRouter from "./routes/ai.route";
import todoRoutes from './routes/todo.route';

import connectDB from "./config/db";
import { corsOptions } from "./config/cors";

import http from "http";
import { initSocket } from "./socket/socket";

// ------------------- APP INIT -------------------
const app: Application = express();

// Trust reverse proxy (Render, Cloudflare, etc.) for HTTPS & secure cookies
app.set("trust proxy", 1);

// create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with server
initSocket(server);

// ------------------- DB CONNECTION -------------------
connectDB();

// ------------------- CORS -------------------
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------- ROUTES -------------------
app.use("/api/auth", authRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/class", classRouter);
app.use("/api/ai", aiRouter);
app.use("/api/todos", todoRoutes); 

// ------------------- HEALTH CHECK -------------------
app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

// ------------------- ERROR HANDLER -------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.message?.startsWith("Not allowed by CORS")) {
    res.status(403).json({
      message: err.message,
      error: "CORS_ORIGIN_DENIED",
    });
    return;
  }
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server + Socket running on port ${PORT}`);
});