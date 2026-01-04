import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";

import healthRoutes from "./routes/health.route.js";
import authRoutes from "./routes/auth.route.js";
import merchantRoutes from "./routes/merchant.route.js";
import planRoutes from "./routes/plan.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import { startSubscriptionExpiryJob } from "./jobs/subscriptionExpiry.job.js";
import { startEthereumListeners } from "./blockchain/ethereum/listener.js";


process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
});

const app = express();

/* =======================
   Global Middlewares
======================= */
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

/* =======================
   Routes
======================= */
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

/* =======================
   Error Handler
======================= */
app.use(errorHandler);

/* =======================
   Server Init
======================= */
const startServer = async () => {
  await connectDB();
   startSubscriptionExpiryJob();
   startEthereumListeners();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();
