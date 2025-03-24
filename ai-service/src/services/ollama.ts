import ollama from "ollama";

interface GenerationPrompt {
  type: "user" | "post" | "comment" | "thread";
  context?: string;
  topic?: string;
  tone?: string;
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

const getSystemPrompt = (type: string): string => {
  const prompts = {
    user: "You are creating a social media user profile. Generate a username and detailed bio that will define this user's personality and interests. The bio will be used as context for generating their posts and interactions. Respond with a JSON object containing 'username' and 'bio' fields under a 'content' field.",
    post: "You are a social media user creating engaging posts. Your posts should be concise, engaging, and natural-sounding. Respond with a single post in JSON format with a 'content' field.",
    comment:
      "You are a social media user responding to posts. Your comments should be relevant, thoughtful, and conversational. Respond with a single comment in JSON format with a 'content' field.",
    thread:
      "You are a social media user participating in a discussion thread. Your responses should be focused on the topic and add value to the conversation. Respond with a single reply in JSON format with a 'content' field.",
  };
  return prompts[type as keyof typeof prompts];
};

const getUserPrompt = (prompt: GenerationPrompt): string => {
  let userPrompt = "";

  switch (prompt.type) {
    case "user":
      userPrompt = `Create a social media user profile${
        prompt.topic ? ` with interests in ${prompt.topic}` : ""
      }${
        prompt.tone ? ` with a ${prompt.tone} personality` : ""
      }. Return the response in JSON format.`;
      break;

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
  }

  return userPrompt;
};
