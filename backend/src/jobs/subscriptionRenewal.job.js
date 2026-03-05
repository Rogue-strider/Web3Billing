import cron from "node-cron";
import Subscription from "../models/Subscription.model.js";

export const startSubscriptionRenewalJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const subs = await Subscription.find({
        status: "active",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: { $lte: now },
      }).populate("plan");

      for (const sub of subs) {
        if (!sub.plan) continue;
        if (sub.currentPeriodEnd > now) continue;

        // 🔁 mock payment
        const paymentSuccess = sub.chain === "ethereum";
        if (!paymentSuccess) continue;

        const newEnd = new Date(sub.currentPeriodEnd);

        if (sub.plan.interval === "monthly") {
          newEnd.setMonth(newEnd.getMonth() + 1);
        } else {
          newEnd.setFullYear(newEnd.getFullYear() + 1);
        }

        sub.currentPeriodStart = now;
        sub.currentPeriodEnd = newEnd;
        sub.status = "active";

        await sub.save();

        console.log(`🔁 Auto-renewed subscription ${sub._id}`);
      }
    } catch (err) {
      console.error("❌ Renewal cron error:", err);
    }
  });

  console.log("✅ Subscription renewal cron started");
};
