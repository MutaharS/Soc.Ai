import { Router } from "express";
import {
  generate,
  generateVariations,
} from "../controllers/contentGenerationController";

const router = Router();

// POST /api/generate - Generate single content
router.post("/", generate);

// POST /api/generate/variations - Generate multiple variations
router.post("/variations", generateVariations);

export default router;
