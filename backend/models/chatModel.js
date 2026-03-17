import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    messageId: { type: String, required: true, unique: false },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: () => new Date().toISOString() },
  },
  { _id: false },
);

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, unique: true },
    title: { type: String },
    type: { type: String },
    createdAt: { type: Date, default: () => new Date().toISOString() },
    userId: { type: String, default: "global" },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: false },
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
