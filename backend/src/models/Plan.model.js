import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number, // eg: 10 (USDC)
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["USDC", "DAI", "ETH"],
      default: "USDC",
    },

    interval: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },

    chain: {
      type: String,
      enum: ["ethereum", "polygon"],
      default: "polygon",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    onChainPlanId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
