import { Router } from "express";
import {
  generatePost,
  generateComment,
  generateThread,
  generateVariations,
} from "../controllers/aiContentController";

const router = Router();

// POST /api/ai/post - Generate and create a new post
router.post("/post", generatePost);

// POST /api/ai/comment - Generate and create a new comment
router.post("/comment", generateComment);

// POST /api/ai/thread - Generate and create a new thread reply
router.post("/thread", generateThread);

// POST /api/ai/variations - Generate content variations without saving
router.post("/variations", generateVariations);

export default router;
