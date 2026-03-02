import cron from "node-cron";
import Subscription from "../models/Subscription.model.js";
import Plan from "../models/Plan.model.js";

export const startSubscriptionRenewalJob = () => {
  // ⏰ run every minute (prod me 5–10 min bhi theek)
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // 1️⃣ find subs eligible for renewal
      const subs = await Subscription.find({
        status: "active",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: { $lte: now },
      }).populate("plan");

      for (const sub of subs) {
        // 2️⃣ MOCK PAYMENT (always success for now)
        const paymentSuccess = true;

        if (!paymentSuccess) continue;

        // 3️⃣ extend period
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
