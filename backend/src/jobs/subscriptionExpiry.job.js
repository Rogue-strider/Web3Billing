// import cron from "node-cron";
// import Subscription from "../models/Subscription.model.js";
// import Merchant from "../models/Merchant.model.js";
// import { sendWebhook } from "../services/webhook.service.js";
// import { WEBHOOK_EVENTS } from "../utils/webhookEvents.js";


// // export const startSubscriptionExpiryJob = () => {
// //   cron.schedule("*/5 * * * *", async () => {
// //     const now = new Date();

// //     const expiredSubs = await Subscription.updateMany(
// //       {
// //         status: "active",
// //         currentPeriodEnd: { $lt: now },
// //       },
// //       {
// //         $set: { status: "expired" },
// //       }
// //     );

// //     if (expiredSubs.modifiedCount > 0) {
// //       console.log(`[CRON] Expired ${expiredSubs.modifiedCount} subscriptions`);
// //     }
// //   });

// //   console.log("🕒 Subscription expiry job started");
// // };


// export const startSubscriptionExpiryJob = () => {
//   cron.schedule("*/5 * * * *", async () => {
//     const now = new Date();

//     // 1️⃣ Cancelled at period end
//     const cancelled = await Subscription.updateMany(
//       {
//         status: "active",
//         cancelAtPeriodEnd: true,
//         currentPeriodEnd: { $lt: now },
//       },
//       {
//         $set: { status: "cancelled" },
//       }
//     );

//     // 2️⃣ Auto-expired (not user cancelled)
//     const expired = await Subscription.updateMany(
//       {
//         status: "active",
//         cancelAtPeriodEnd: false,
//         currentPeriodEnd: { $lt: now },
//       },
//       {
//         $set: { status: "expired" },
//       }
//     );

//     if (cancelled.modifiedCount || expired.modifiedCount) {
//       console.log(
//         `[CRON] Cancelled: ${cancelled.modifiedCount}, Expired: ${expired.modifiedCount}`
//       );
//     }
//   });

//   console.log("🕒 Subscription expiry job started");
// };


import cron from "node-cron";
import Subscription from "../models/Subscription.model.js";

export const startSubscriptionExpiryJob = () => {
  // ⏰ Run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const result = await Subscription.updateMany(
        {
          status: "active",
          currentPeriodEnd: { $lt: now },
        },
        {
          $set: {
            status: "expired",
            cancelAtPeriodEnd: false,
          },
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
