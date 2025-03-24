import { Request, Response } from "express";
import { generateContent } from "../services/ollama";

interface GenerateRequest {
  type: "user" | "post" | "comment" | "thread";
  context?: string;
  topic?: string;
  tone?: string;
}

// Generate content
export const generate = async (
  req: Request<{}, {}, GenerateRequest>,
  res: Response
) => {
  try {
    const { type, context, topic, tone } = req.body;

    if (!type) {
      res.status(400).json({ message: "Content type is required" });
      return;
    }

    const content = await generateContent({
      type,
      context,
      topic,
      tone,
    });

    try {
      // Try to parse the response as JSON
      const jsonContent = JSON.parse(content);
      res.json({ content: jsonContent.content });
    } catch (parseError) {
      // If parsing fails, return the raw content
      res.json({ content, parseError: parseError });
    }
  } catch (error) {
    console.error("Error in content generation:", error);
    res.status(500).json({ message: "Error generating content", error });
  }
};

// Generate multiple variations
export const generateVariations = async (
  req: Request<{}, {}, GenerateRequest & { count: number }>,
  res: Response
) => {
  try {
    const { type, context, topic, tone, count = 3 } = req.body;

    if (!type) {
      res.status(400).json({ message: "Content type is required" });
      return;
    }

    const variations = await Promise.all(
      Array(count)
        .fill(null)
        .map(() =>
          generateContent({
            type,
            context,
            topic,
            tone,
          })
        )
    );

    const processedVariations = variations.map((content) => {
      try {
        // Try to parse each variation as JSON
        const jsonContent = JSON.parse(content);
        return jsonContent.content;
      } catch (parseError) {
        // If parsing fails, return the raw content
        return content;
      }
    });

    res.json({ variations: processedVariations });
  } catch (error) {
    console.error("Error in variations generation:", error);
    res.status(500).json({ message: "Error generating variations", error });
  }
};
