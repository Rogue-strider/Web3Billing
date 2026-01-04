import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    nonce: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["merchant", "customer"],
      default: "merchant",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
