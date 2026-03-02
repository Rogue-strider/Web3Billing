import cron from "node-cron";
import Subscription from "../models/Subscription.model.js";

export const startSubscriptionExpiryJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const result = await Subscription.updateMany(
        {
          status: "active",
          cancelAtPeriodEnd: true,
          currentPeriodEnd: { $lte: now },
        },
        {
          $set: { status: "expired" },
        },
      );

      if (result.modifiedCount > 0) {
        console.log(`⏰ Auto-expired ${result.modifiedCount} subscriptions`);
      }
    } catch (err) {
      console.error("❌ Subscription expiry job error:", err);
    }
  });

  console.log("✅ Subscription expiry cron started");
};
