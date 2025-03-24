import { Router } from "express";
import {
  getCommentThreads,
  getThread,
  createThread,
  updateThread,
  deleteThread,
} from "../controllers/threadController";

const router = Router();

// GET /api/threads/comment/:commentId - Get all threads for a comment
router.get("/comment/:commentId", getCommentThreads);

// GET /api/threads/:id - Get single thread
router.get("/:id", getThread);

// POST /api/threads - Create new thread
router.post("/", createThread);

// PUT /api/threads/:id - Update thread
router.put("/:id", updateThread);

// DELETE /api/threads/:id - Delete thread
router.delete("/:id", deleteThread);

export default router;
