import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  createClass,
  startClass,
  endClass,
  joinClass,
  getClassById,
  getClassByCode,
  uploadClassPDF,
  getClassPDF,
  deleteClassPDF,
} from "../controllers/class.controller";

const router = express.Router();

// Look up class by 6-character code
router.get("/code/:code", authMiddleware, getClassByCode);

// Instructor routes
router.post("/create", authMiddleware, createClass);
router.post("/:classId/start", authMiddleware, startClass);
router.post("/:classId/end", authMiddleware, endClass);

// PDF Slide Management
router.post("/:classId/pdf", authMiddleware, uploadClassPDF);
router.get("/:classId/pdf", getClassPDF);
router.delete("/:classId/pdf", authMiddleware, deleteClassPDF);

// Get class by MongoDB ID
router.get("/:id", authMiddleware, getClassById);

// Student route
router.post("/join", authMiddleware, joinClass);

export default router;