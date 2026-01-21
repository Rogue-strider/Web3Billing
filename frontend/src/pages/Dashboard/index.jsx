import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WalletContext } from "../../contexts/WalletContext";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import {
  getMySubscriptions,
  cancelSubscription,
} from "../../services/subscription.service";
import toast from "react-hot-toast";
import { socket } from "../../services/socket";
import MRRChart from "../../components/charts/MRRChart";
import ActiveSubsChart from "../../components/charts/ActiveSubsChart";

const Dashboard = () => {
  const { isConnected, authReady, account } = useContext(WalletContext);

  const [subscriptions, setSubscriptions] = useState([]);

  /* =======================
     🔥 REAL-TIME STATS STATE
  ======================= */
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscribers: 0,
    mrr: 0,
    churnRate: 0,
  });

  const [charts, setCharts] = useState({
    mrrOverTime: [],
    activeSubsOverTime: [],
  });

  /* =======================
     LOAD SUBSCRIPTIONS (API)
  ======================= */
  useEffect(() => {
    if (!isConnected || !authReady) return;

    const load = async () => {
      try {
        const res = await getMySubscriptions();
        setSubscriptions(
          Array.isArray(res?.data?.subscriptions) ? res.data.subscriptions : [],
        );
      } catch (err) {
        toast.error("Failed to load subscriptions");
      }
    };

    load();
  }, [isConnected, authReady]);

  /* =======================
     SOCKET REAL-TIME
  ======================= */
  useEffect(() => {
    if (!isConnected || !authReady || !account) return;

    socket.connect();
    socket.emit("join", account.toLowerCase());
    socket.emit("charts:range", "30d");

    /* SUB CREATED */
    socket.on("subscription:created", ({ subscription }) => {
      setSubscriptions((prev) => {
        const map = new Map(prev.map((s) => [s._id, s]));
        map.set(subscription._id, subscription);
        return Array.from(map.values());
      });
    });

    /* SUB CANCELLED */
    socket.on("subscription:cancelled", ({ subscription }) => {
      setSubscriptions((prev) =>
        prev.map((s) => (s._id === subscription._id ? subscription : s)),
      );
    });

    /* 🔥 STATS UPDATE */
    socket.on("stats:update", (liveStats) => {
      setStats(liveStats);
    });

    socket.on("charts:update", (data) => {
      setCharts(data);
    });

    return () => {
      socket.off("subscription:created");
      socket.off("subscription:cancelled");
      socket.off("stats:update");
    };
  }, [isConnected, authReady, account]);

  /* =======================
     SPLIT SUBSCRIPTIONS
  ======================= */
  const activeSubs = subscriptions.filter(
    (sub) => sub.status === "active" && !sub.cancelAtPeriodEnd,
  );

  const cancellingSubs = subscriptions.filter(
    (sub) => sub.status === "active" && sub.cancelAtPeriodEnd,
  );

  const historySubs = subscriptions.filter(
    (sub) =>
      sub.status === "expired" ||
      (sub.status === "active" && sub.cancelAtPeriodEnd),
  );

  /* =======================
     CANCEL HANDLER
  ======================= */
  const handleCancel = async (sub) => {
    try {
      await cancelSubscription(sub._id);
      toast.success("Subscription will cancel at period end");

      setSubscriptions((prev) =>
        prev.map((s) =>
          s._id === sub._id ? { ...s, cancelAtPeriodEnd: true } : s,
        ),
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cancel failed");
    }
  };

  /* =======================
     NOT CONNECTED
  ======================= */
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400">
            Please connect your wallet to access the dashboard
          </p>
        </div>
      </div>
    );
  }

  /* =======================
     STATS UI (SAME DESIGN)
  ======================= */
  const statsUI = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${stats.totalRevenue}`,
      change: "+12.5%",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      label: "Active Subscribers",
      value: stats.activeSubscribers,
      change: "+8.2%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      label: "MRR",
      value: `$${stats.mrr}`,
      change: "+15.3%",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      label: "Churn Rate",
      value: `${stats.churnRate}%`,
      change: "-1.2%",
      color: "from-orange-500 to-red-500",
    },
  ];

  /* =======================
     DASHBOARD UI
  ======================= */
  return (
    <div className="min-h-screen px-6 pt-28 pb-12 text-white">
      <div className="container mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your overview.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsUI.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-30`}
                />
                <div className="relative bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        stat.change.startsWith("+")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mb-6">
          {["7d", "30d", "90d", "all"].map((r) => (
            <button
              key={r}
              onClick={() => {
                socket.emit("charts:range", r);
              }}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-purple-600 transition"
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-900 bg-opacity-40 p-6 rounded-xl border border-white border-opacity-10">
            <h3 className="text-xl font-semibold mb-4">MRR Over Time</h3>
            <MRRChart data={charts.mrrOverTime || []} />
          </div>

          <div className="bg-gray-900 bg-opacity-40 p-6 rounded-xl border border-white border-opacity-10">
            <h3 className="text-xl font-semibold mb-4">
              Active Subscribers Over Time
            </h3>
            <ActiveSubsChart data={charts.activeSubsOverTime || []} />
          </div>
        </div>

        {/* ACTIVE / CANCELLING */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">My Subscriptions</h2>

          <div className="grid gap-6">
            {[...activeSubs, ...cancellingSubs].map((sub) => (
              <div
                key={sub._id}
                className="bg-gray-900 bg-opacity-50 border border-white border-opacity-10 rounded-xl p-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">
                    Plan: {sub.plan?.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status:{" "}
                    {sub.cancelAtPeriodEnd ? "Cancels at period end" : "Active"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Ends: {new Date(sub.currentPeriodEnd).toLocaleString()}
                  </p>
                </div>

                {!sub.cancelAtPeriodEnd && (
                  <button
                    onClick={() => handleCancel(sub)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HISTORY */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Subscription History</h2>

          <div className="grid gap-6">
            {historySubs.map((sub) => (
              <div
                key={sub._id}
                className="bg-gray-900 bg-opacity-30 border border-white border-opacity-5 rounded-xl p-6"
              >
                <p className="font-semibold">Plan: {sub.plan?.name}</p>
                <p className="text-sm text-gray-400">
                  Expired on: {new Date(sub.currentPeriodEnd).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* COMING SOON (UNCHANGED) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-12 text-center border border-white border-opacity-20"
        >
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold mb-4">
            More Features Coming Soon!
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Advanced analytics, plan management, earnings & more.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
