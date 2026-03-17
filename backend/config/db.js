import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing from environment variables");
  }

  await mongoose.connect(uri, {
    dbName: "ai_content_creator",
    autoIndex: true,
  });
};

export default connectDB;
