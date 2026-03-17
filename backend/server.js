import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";

import connectDB from "./config/db.js";
import historyRoutes from "./routes/historyRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Load env variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB (❌ don't crash server)
connectDB().then(() => {
  console.log("MongoDB Connected ✅");
}).catch((err) => {
  console.error("MongoDB connection failed ❌", err.message);
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Root route (important for Render)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/history", historyRoutes);
app.use("/analyze", analysisRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// PORT (Render friendly)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});