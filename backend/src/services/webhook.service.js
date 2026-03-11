import axios from "axios";
import crypto from "crypto";

/* =====================================
   SEND WEBHOOK
===================================== */

export const sendWebhook = async ({ url, event, payload }) => {
  if (!url) return;

  try {
    const body = {
      event,
      data: payload,
      timestamp: new Date().toISOString(),
    };

    /* =========================
       SIGNATURE (HMAC SHA256)
    ========================= */

    const signature = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET || "web3billing_secret")
      .update(JSON.stringify(body))
      .digest("hex");

    await axios.post(url, body, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        "x-webhook-signature": signature,
      },
    });

    console.log(`📡 Webhook sent → ${event}`);
  } catch (error) {
    console.error(
      `❌ Webhook failed (${event}) →`,
      url,
      error?.response?.data || error.message,
    );

    /* =====================================
       FUTURE IMPROVEMENTS
       - retry queue
       - dead letter queue
       - webhook logs
    ===================================== */
  }
};
