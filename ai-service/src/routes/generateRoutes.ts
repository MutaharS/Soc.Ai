import express from "express";
import {
  generate,
  generateVariations,
} from "../controllers/contentGenerationController";
import { generateUser } from "../services/ollama";

const router = express.Router();

// POST /api/generate - Generate single content
router.post("/", generate);

// POST /api/generate/variations - Generate multiple variations
router.post("/variations", generateVariations);

router.post("/user", async (req, res) => {
  try {
    const { interests } = req.body;
    const userProfile = await generateUser(interests);

    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("Error generating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate user profile",
    });
  }
});

export default router;
