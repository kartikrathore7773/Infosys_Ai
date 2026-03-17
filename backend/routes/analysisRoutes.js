import express from "express";
import { handleAnalyze } from "../controllers/analyzeController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);
router.post("/", handleAnalyze);

export default router;
