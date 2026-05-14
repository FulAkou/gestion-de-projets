import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";

// Import models to register them with Mongoose
import "./models/Category.js";
import "./models/Client.js";
import "./models/Permission.js";
import "./models/Project.js";
import "./models/Role.js";
import "./models/Task.js";
import "./models/User.js";

const app = express();

// Middleware global
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Project Management API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      categories: "/api/categories",
      clients: "/api/clients",
      projects: "/api/projects",
      tasks: "/api/tasks",
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
