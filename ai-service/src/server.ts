import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contentGenerationRoutes from "./routes/contentGeneration";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route - register this before other routes
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to Soc.Ai Content Generation API" });
});

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

// Content generation routes
app.use("/api/generate", contentGenerationRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
);

// Handle 404 routes
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`AI Service is running on port ${PORT}`);
  console.log(`Root path available at http://localhost:${PORT}/`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Handle server errors
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
