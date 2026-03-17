import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date().toISOString() },
  },
  { timestamps: false },
);

const User = mongoose.model("User", userSchema);
export default User;
