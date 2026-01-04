import cron from "node-cron";
import Subscription from "../models/Subscription.model.js";
import Merchant from "../models/Merchant.model.js";
import { sendWebhook } from "../services/webhook.service.js";
import { WEBHOOK_EVENTS } from "../utils/webhookEvents.js";


export const startSubscriptionExpiryJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();

    const expiredSubs = await Subscription.updateMany(
      {
        status: "active",
        currentPeriodEnd: { $lt: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    if (expiredSubs.modifiedCount > 0) {
      console.log(`[CRON] Expired ${expiredSubs.modifiedCount} subscriptions`);
    }
  });

  console.log("🕒 Subscription expiry job started");
};
