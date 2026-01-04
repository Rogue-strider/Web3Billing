// import mongoose from "mongoose";
// import { env } from "./env.js";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(env.MONGODB_URI);
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB connection failed", err);
//     process.exit(1);
//   }
// };

import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 sec me Mongo na mile to fail
      socketTimeoutMS: 45000, // idle socket timeout
      maxPoolSize: 10, // connection pool limit
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};