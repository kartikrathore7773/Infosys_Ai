import { randomUUID } from "crypto";
import Chat from "../models/chatModel.js";

const formatChat = (chat) => ({
  chatId: chat.chatId,
  title: chat.title,
  type: chat.type,
  createdAt: chat.createdAt,
  userId: chat.userId,
  messages: chat.messages || [],
});

const resolveUserId = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error("Authentication required");
  }
  return userId;
};

export const getHistory = async (req, res) => {
  const userId = resolveUserId(req, res);
  const chats = await Chat.find({ userId })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  res.json(chats.map(formatChat));
};

export const createHistory = async (req, res) => {
  const { chatId, title, type, createdAt, messages } = req.body || {};
  const userId = resolveUserId(req, res);
  const doc = await Chat.create({
    chatId: chatId || randomUUID(),
    title,
    type,
    createdAt: createdAt || new Date().toISOString(),
    userId,
    messages: Array.isArray(messages) ? messages : [],
  });

  res.status(201).json(formatChat(doc));
};

export const addMessage = async (req, res) => {
  const { chat_id } = req.params;
  const userId = resolveUserId(req, res);
  const { role, content, meta, messageId, createdAt } = req.body || {};
  const message = {
    messageId: messageId || randomUUID(),
    role,
    content,
    meta,
    createdAt: createdAt || new Date().toISOString(),
  };

  const chat = await Chat.findOneAndUpdate(
    { chatId: chat_id, userId },
    { $push: { messages: message } },
    { new: true },
  );

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  res.json(message);
};

export const updateTitle = async (req, res) => {
  const { chat_id } = req.params;
  const userId = resolveUserId(req, res);
  const { title } = req.body || {};

  if (!title) return res.status(400).json({ error: "Title is required" });

  const chat = await Chat.findOneAndUpdate(
    { chatId: chat_id, userId },
    { title },
    { new: true },
  );

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  res.json({ chatId: chat.chatId, title: chat.title });
};

export const deleteChat = async (req, res) => {
  const { chat_id } = req.params;
  const userId = resolveUserId(req, res);

  const result = await Chat.deleteOne({ chatId: chat_id, userId });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Chat not found" });
  }

  res.json({ chatId: chat_id });
};
