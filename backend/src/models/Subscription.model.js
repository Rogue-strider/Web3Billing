import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "past_due"],
      default: "active",
    },

    currentPeriodStart: {
      type: Date,
      required: true,
    },

    currentPeriodEnd: {
      type: Date,
      required: true,
    },

    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },

    chain: {
      type: String,
      enum: ["ethereum", "polygon"],
      default: "ethereum",
    },

    onChainSubscriptionId: {
      type: String,
      required: true,
      // unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
