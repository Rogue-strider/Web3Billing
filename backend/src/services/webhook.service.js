import axios from "axios";
import crypto from "crypto";
import WebhookEvent from "../models/WebhookEvent.model.js";

/* =====================================
   SEND WEBHOOK
===================================== */

export const sendWebhook = async ({ url, event, payload, merchantId }) => {
  if (!url) return;

  const body = {
    event,
    data: payload,
    timestamp: new Date().toISOString(),
  };

  const signature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET || "web3billing_secret")
    .update(JSON.stringify(body))
    .digest("hex");

  try {
    const res = await axios.post(url, body, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        "x-webhook-signature": signature,
      },
    });

    /* STORE SUCCESS EVENT */

    await WebhookEvent.create({
      merchant: merchantId,
      event,
      payload,
      status: "success",
      responseStatus: res.status,
    });

    console.log(`📡 Webhook sent → ${event}`);
  } catch (error) {
    /* STORE FAILED EVENT */

    await WebhookEvent.create({
      merchant: merchantId,
      event,
      payload,
      status: "failed",
      error: error?.response?.data || error.message,
    });

    console.error(
      `❌ Webhook failed (${event}) →`,
      url,
      error?.response?.data || error.message,
    );
  }
};
