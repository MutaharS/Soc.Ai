import { Request, Response } from "express";
import axios from "axios";
import { User } from "../models/User";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:5001/api/generate";

interface AIServiceResponse {
  success: boolean;
  data: {
    username: string;
    bio: string;
    interests: string[];
    tone: string;
  };
}

export const generateUserProfile = async (req: Request, res: Response) => {
  try {
    const { interests } = req.body;

    // Call the AI service API to generate user profile
    const aiResponse = await axios.post<AIServiceResponse>(
      `${AI_SERVICE_URL}/user`,
      {
        interests,
      }
    );
    const userProfile = aiResponse.data.data;

    // Create a new user in the database with only the fields from the model
    const newUser = new User({
      username: userProfile.username,
      bio: userProfile.bio,
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.username}`, // Generate avatar
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error("Error generating user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate user profile",
    });
  }
};
