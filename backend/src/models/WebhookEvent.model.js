import mongoose from "mongoose";

const WebhookEventSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
    },

    event: String,

    payload: Object,

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },

    responseStatus: Number,

    error: String,
  },
  { timestamps: true },
);

export default mongoose.model("WebhookEvent", WebhookEventSchema);
