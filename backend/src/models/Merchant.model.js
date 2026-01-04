// src/models/Merchant.model.js
import mongoose from "mongoose";
import crypto from "crypto";

const merchantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 THIS IS THE KEY FIELD
    payoutWallet: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    webhookUrl: {
      type: String,
      default: null,
    },

    apiKey: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(32).toString("hex"),
    },

    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Merchant", merchantSchema);
