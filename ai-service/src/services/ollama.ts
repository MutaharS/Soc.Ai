import ollama from "ollama";

interface GenerationPrompt {
  type: "post" | "comment" | "thread" | "user";
  context?: string;
  topic?: string;
  tone?: string;
}

interface UserGenerationResponse {
  username: string;
  bio: string;
  interests: string[];
  tone: string;
}

export const generateContent = async (
  prompt: GenerationPrompt
): Promise<string> => {
  try {
    const systemPrompt = getSystemPrompt(prompt.type);
    const userPrompt = getUserPrompt(prompt);
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const output = await ollama.generate({
      model: "phi3",
      prompt: fullPrompt,
      stream: false,
      format: "json",
    });

    return output.response || "No content generated";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
};

export const generateUser = async (
  interests?: string[]
): Promise<UserGenerationResponse> => {
  try {
    const systemPrompt =
      "You are creating a social media user profile. Generate a unique username, a detailed bio, and a consistent personality tone. Return the response in JSON format with fields: username, bio, interests (array), and tone.";
    const userPrompt = interests
      ? `Create a user profile interested in: ${interests.join(", ")}`
      : "Create a random user profile with unique interests and personality";

    const output = await ollama.generate({
      model: "phi3",
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      stream: false,
      format: "json",
    });

    try {
      const parsedResponse = JSON.parse(output.response);
      return {
        username: parsedResponse.username || "default_user",
        bio: parsedResponse.bio || "No bio available",
        interests: parsedResponse.interests || [],
        tone: parsedResponse.tone || "neutral",
      };
    } catch (parseError) {
      console.error("Error parsing user generation response:", parseError);
      throw new Error("Failed to parse user generation response");
    }
  } catch (error) {
    console.error("Error generating user:", error);
    throw new Error("Failed to generate user");
  }
};

const getSystemPrompt = (type: string): string => {
  const prompts = {
    post: "You are a social media user creating engaging posts. Your posts should be concise, engaging, and natural-sounding. Respond with a single post in JSON format with a 'content' field.",
    comment:
      "You are a social media user responding to posts. Your comments should be relevant, thoughtful, and conversational. Respond with a single comment in JSON format with a 'content' field.",
    thread:
      "You are a social media user participating in a discussion thread. Your responses should be focused on the topic and add value to the conversation. Respond with a single reply in JSON format with a 'content' field.",
    user: "You are creating a social media user profile. Generate a unique username, a detailed bio, and a consistent personality tone. Return the response in JSON format.",
  };
  return prompts[type as keyof typeof prompts];
};

const getUserPrompt = (prompt: GenerationPrompt): string => {
  let userPrompt = "";

  switch (prompt.type) {
    case "post":
      userPrompt = `Create a social media post${
        prompt.topic ? ` about ${prompt.topic}` : ""
      }${
        prompt.tone ? ` with a ${prompt.tone} tone` : ""
      }. Return the response in JSON format.`;
      break;

    case "comment":
      userPrompt = `Write a comment in response to: "${prompt.context}"${
        prompt.tone ? ` with a ${prompt.tone} tone` : ""
      }. Return the response in JSON format.`;
      break;

    case "thread":
      userPrompt = `Write a reply in a discussion about: "${prompt.context}"${
        prompt.tone ? ` with a ${prompt.tone} tone` : ""
      }. Return the response in JSON format.`;
      break;

    case "user":
      userPrompt = `Create a user profile${
        prompt.topic ? ` interested in ${prompt.topic}` : ""
      }${
        prompt.tone ? ` with a ${prompt.tone} personality` : ""
      }. Return the response in JSON format with username, bio, interests, and tone.`;
      break;
  }

  return userPrompt;
};
