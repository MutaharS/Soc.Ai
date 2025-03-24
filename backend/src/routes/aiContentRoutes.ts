import { Router } from "express";
import {
  generatePost,
  generateComment,
  generateThread,
  generateVariations,
} from "../controllers/aiContentController";
import { generateUserProfile } from "../controllers/aiUserController";

const router = Router();

// POST /api/ai/post - Generate and create a new post
router.post("/post", generatePost);

// POST /api/ai/comment - Generate and create a new comment
router.post("/comment", generateComment);

// POST /api/ai/thread - Generate and create a new thread reply
router.post("/thread", generateThread);

// POST /api/ai/variations - Generate content variations without saving
router.post("/variations", generateVariations);

// POST /api/ai/user - Generate a user profile
router.post("/user", generateUserProfile);

export default router;
