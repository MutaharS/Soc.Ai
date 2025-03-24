import { apiClient } from "./config";

export interface User {
  _id: string;
  username: string;
  profilePicture: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateUserRequest {
  interests?: string[];
}

export const usersApi = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  // Get a single user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Generate AI user
  generateUser: async (data: GenerateUserRequest): Promise<User> => {
    const response = await apiClient.post("/ai/user", data);
    return response.data.data; // The response is wrapped in a data property
  },
};
