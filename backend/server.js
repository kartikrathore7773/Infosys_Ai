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

dotenv.config();

const app = express();
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/history", historyRoutes);
app.use("/analyze", analysisRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express API listening on port ${PORT}`);
});
