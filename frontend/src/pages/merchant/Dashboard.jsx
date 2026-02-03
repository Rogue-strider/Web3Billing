import React, { useEffect, useState, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { socket } from "../../services/socket";

const MerchantDashboard = () => {
  const { account } = useContext(WalletContext);

  const [stats, setStats] = useState({
    revenue: 0,
    activeSubs: 0,
    mrr: 0,
  });

  useEffect(() => {
    if (!account) return;

    socket.connect();

    /* 🔥 Join merchant room (wallet based) */
    socket.emit("merchant:join", account.toLowerCase());

    socket.on("merchant:stats:update", (data) => {
      setStats(data);
    });

    return () => {
      socket.off("merchant:stats:update");
    };
  }, [account]);

  return (
    <div className="min-h-screen px-6 pt-24 text-white">
      <h1 className="text-4xl font-bold mb-8">Merchant Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400 mb-2">Total Revenue</p>
          <p className="text-2xl font-bold">${stats.revenue}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400 mb-2">Active Subscriptions</p>
          <p className="text-2xl font-bold">{stats.activeSubs}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400 mb-2">Monthly Recurring Revenue</p>
          <p className="text-2xl font-bold">${stats.mrr}</p>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
