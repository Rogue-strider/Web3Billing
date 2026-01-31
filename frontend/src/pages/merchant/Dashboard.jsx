import React, { useEffect, useState } from "react";
import { socket } from "../../services/socket";

const MerchantDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    activeSubs: 0,
    mrr: 0,
  });

  useEffect(() => {
    socket.emit("merchant:stats");

    socket.on("merchant:stats:update", (data) => {
      setStats(data);
    });

    return () => {
      socket.off("merchant:stats:update");
    };
  }, []);

  return (
    <div className="min-h-screen px-6 pt-24 text-white">
      <h1 className="text-4xl font-bold mb-8">Merchant Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl">
          Revenue: ${stats.revenue}
        </div>
        <div className="bg-gray-900 p-6 rounded-xl">
          Active Subs: {stats.activeSubs}
        </div>
        <div className="bg-gray-900 p-6 rounded-xl">MRR: ${stats.mrr}</div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
