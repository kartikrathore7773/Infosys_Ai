import express from "express";
import {
  getHistory,
  createHistory,
  addMessage,
  updateTitle,
  deleteChat,
} from "../controllers/historyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getHistory);
router.post("/", createHistory);
router.post("/:chat_id/messages", addMessage);
router.put("/:chat_id/title", updateTitle);
router.delete("/:chat_id", deleteChat);

export default router;
