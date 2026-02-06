import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";

import healthRoutes from "./routes/health.route.js";
import authRoutes from "./routes/auth.route.js";
import merchantRoutes from "./routes/merchant.route.js";
import planRoutes from "./routes/plan.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import merchantDashboardRoutes from "./routes/merchantDashboard.route.js";

import { startSubscriptionExpiryJob } from "./jobs/subscriptionExpiry.job.js";
import { startEthereumListeners } from "./blockchain/ethereum/listener.js";
import { getDashboardCharts } from "./services/charts.service.js";
import merchantPlansRoutes from "./routes/merchantPlans.route.js";

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  /* USER JOIN ROOM */
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("👤 User joined room:", userId);
  });

  /* MERCHANT JOIN ROOM */
  socket.on("merchant:join", (merchantId) => {
    socket.join(merchantId);
    console.log("🏪 Merchant joined room:", merchantId);
  });

  /* CHART RANGE CHANGE */
  socket.on("charts:range", async (range) => {
    const charts = await getDashboardCharts(range);
    socket.emit("charts:update", charts);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* ================= MIDDLEWARE ================= */
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

/* ================= ROUTES ================= */
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/merchant/dashboard", merchantDashboardRoutes);
app.use("/api/merchant/plans", merchantPlansRoutes);

app.use(errorHandler);

/* ================= START ================= */
const startServer = async () => {
  await connectDB();
  startSubscriptionExpiryJob();
  startEthereumListeners();

  server.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();
