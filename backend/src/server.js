import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/database.js";

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(() => {
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `🌐 API URL: ${process.env.CORS_ORIGIN || "https://gestion-de-projets-seven.vercel.app/"}`,
      );
      console.log(
        `💚 Health check: ${process.env.CORS_ORIGIN || "https://gestion-de-projets-seven.vercel.app/"}api/health`,
      );
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("👋 SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.log("🛑 HTTP server closed");
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
