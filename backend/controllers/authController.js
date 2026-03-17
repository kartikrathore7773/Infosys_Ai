import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateToken } from "../middleware/auth.js";

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name || "",
});

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    res.status(409);
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    name: name?.trim() || "",
  });

  const token = generateToken({ sub: user._id.toString(), email: user.email });
  res.status(201).json({ token, user: sanitizeUser(user) });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ sub: user._id.toString(), email: user.email });
  res.json({ token, user: sanitizeUser(user) });
};
