import cron from "node-cron";
import Subscription from "../models/Subscription.model.js";

export const startGraceExpiryJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const result = await Subscription.updateMany(
        {
          status: "past_due",
          gracePeriodEnd: { $lte: now },
        },
        {
          $set: { status: "expired" },
        },
      );

      if (result.modifiedCount > 0) {
        console.log(
          `⏳ Grace expired for ${result.modifiedCount} subscriptions`,
        );
      }
    } catch (err) {
      console.error("❌ Grace expiry job error:", err);
    }
  });

  console.log("✅ Grace expiry cron started");
};
