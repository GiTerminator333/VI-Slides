import express from "express";
import { generateAIAnswer } from "../controllers/ai.controller";
import authMiddleware from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";

const router = express.Router();

// Allow both Students and Instructors to use AI Doubt Assistance
router.post(
  "/answer",
  authMiddleware,
  allowRoles("Instructor", "Student"),
  generateAIAnswer
);

export default router;