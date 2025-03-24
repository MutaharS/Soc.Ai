import { Router } from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController";

const router = Router();

// GET /api/posts - Get all posts
router.get("/", getPosts);

// GET /api/posts/:id - Get single post
router.get("/:id", getPost);

// POST /api/posts - Create new post
router.post("/", createPost);

// PUT /api/posts/:id - Update post
router.put("/:id", updatePost);

// DELETE /api/posts/:id - Delete post
router.delete("/:id", deletePost);

export default router;
