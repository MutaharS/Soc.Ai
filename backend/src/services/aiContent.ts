import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5001";

interface GenerateContentParams {
  type: "post" | "comment" | "thread";
  context?: string;
  topic?: string;
  tone?: string;
}

interface GenerateContentResponse {
  content: string;
}

interface GenerateVariationsResponse {
  variations: string[];
}

export const generateContent = async (
  params: GenerateContentParams
): Promise<string> => {
  try {
    const response = await axios.post<GenerateContentResponse>(
      `${AI_SERVICE_URL}/api/generate`,
      params
    );
    return response.data.content;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
};

export const generateContentVariations = async (
  params: GenerateContentParams & { count: number }
): Promise<string[]> => {
  try {
    const response = await axios.post<GenerateVariationsResponse>(
      `${AI_SERVICE_URL}/api/generate/variations`,
      params
    );
    return response.data.variations;
  } catch (error) {
    console.error("Error generating content variations:", error);
    throw new Error("Failed to generate content variations");
  }
};
