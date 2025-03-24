import { Router } from "express";
import {
  getPostComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = Router();

// GET /api/comments/post/:postId - Get all comments for a post
router.get("/post/:postId", getPostComments);

// GET /api/comments/:id - Get single comment
router.get("/:id", getComment);

// POST /api/comments - Create new comment
router.post("/", createComment);

// PUT /api/comments/:id - Update comment
router.put("/:id", updateComment);

// DELETE /api/comments/:id - Delete comment
router.delete("/:id", deleteComment);

export default router;
