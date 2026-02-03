import React, { useEffect, useState, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { socket } from "../../services/socket";
import toast from "react-hot-toast";

const MerchantDashboard = () => {
  const { account, isConnected } = useContext(WalletContext);

  const [stats, setStats] = useState({
    revenue: 0,
    activeSubs: 0,
    mrr: 0,
  });

  /* =========================
     SOCKET REAL-TIME
  ========================= */
  useEffect(() => {
    if (!isConnected || !account) return;

    socket.connect();

    // 🔥 IMPORTANT: Merchant room join
    socket.emit("join", account.toLowerCase());

    // 🔥 Ask backend for initial stats
    socket.emit("merchant:stats");

    socket.on("merchant:stats:update", (data) => {
      setStats(data);
    });

    return () => {
      socket.off("merchant:stats:update");
    };
  }, [isConnected, account]);

  /* =========================
     NOT CONNECTED
  ========================= */
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Connect wallet to access merchant dashboard
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-28 pb-12 text-white">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Merchant Dashboard
        </h1>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-900 bg-opacity-60 p-6 rounded-xl border border-white border-opacity-10">
            <p className="text-gray-400 mb-2">Total Revenue</p>
            <h2 className="text-3xl font-bold">
              ${stats.revenue}
            </h2>
          </div>

          <div className="bg-gray-900 bg-opacity-60 p-6 rounded-xl border border-white border-opacity-10">
            <p className="text-gray-400 mb-2">Active Subscriptions</p>
            <h2 className="text-3xl font-bold">
              {stats.activeSubs}
            </h2>
          </div>

          <div className="bg-gray-900 bg-opacity-60 p-6 rounded-xl border border-white border-opacity-10">
            <p className="text-gray-400 mb-2">Monthly Recurring Revenue</p>
            <h2 className="text-3xl font-bold">
              ${stats.mrr}
            </h2>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MerchantDashboard;
