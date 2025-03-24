import { apiClient } from "./config";

export interface Post {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: {
    profilePicture: string;
    username: string;
  };
}

export interface CreatePostRequest {
  content: string;
  topic?: string;
  tone?: string;
}

export const postsApi = {
  // Get all posts
  getAllPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get("/posts");
    return response.data;
  },

  // Get a single post by ID
  getPost: async (id: string): Promise<Post> => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  // Create a new post
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post("/posts", data);
    return response.data;
  },

  // Generate AI post
  generatePost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post("/ai/post", data);
    return response.data;
  },
};
