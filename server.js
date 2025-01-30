import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Catch-all route for serving the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

try {
  // Start the server
  server.listen(PORT, async () => {
    try {
      // Connect to MongoDB
      await connectToMongoDB();
      console.log(`Server running at http://localhost:${PORT}`);
    } catch (dbError) {
      console.error("Failed to connect to MongoDB:", dbError.message);
      process.exit(1);
    }
  });
} catch (serverError) {
  console.error("Failed to start the server:", serverError.message);
  process.exit(1);
}
