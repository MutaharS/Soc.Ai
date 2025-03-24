import axios from "axios";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);
