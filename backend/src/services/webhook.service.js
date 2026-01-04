import axios from "axios";
import crypto from "crypto";

export const sendWebhook = async ({ url, event, payload }) => {
  try {
    // ⚠️ Future: HMAC signature add yahin hoga
    await axios.post(
      url,
      {
        event,
        data: payload,
        timestamp: new Date().toISOString(),
      },
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // ❌ Abhi sirf log
    console.error("[WEBHOOK FAILED]", url, error.message);

    // 🔜 Future:
    // retry queue
    // dead letter queue
  }
};
