import React, { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const MerchantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/merchant/dashboard");
        setData(res.data);
      } catch (err) {
        toast.error("Failed to load merchant dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const { merchant, stats, plans, planStats, recentSubscriptions } = data;

  return (
    <div className="min-h-screen px-6 pt-28 pb-12 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Merchant Dashboard</h1>
        <p className="text-gray-400 mb-10">
          {merchant.businessName} • {merchant.status}
        </p>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Stat label="Total Revenue" value={`$${stats.totalRevenue}`} />
          <Stat label="Active Subs" value={stats.activeSubscribers} />
          <Stat label="Cancelled" value={stats.cancelledSubscribers} />
          <Stat label="Plans" value={stats.totalPlans} />
        </div>

        {/* PLANS */}
        <h2 className="text-2xl font-bold mb-4">Plans</h2>
        <div className="grid gap-4 mb-12">
          {plans.map((p) => (
            <div
              key={p._id}
              className="bg-gray-900 p-4 rounded-lg border border-white/10"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-gray-400 text-sm">
                    ${p.price} / {p.interval}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    p.isActive ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT SUBS */}
        <h2 className="text-2xl font-bold mb-4">Recent Subscriptions</h2>
        <div className="grid gap-4">
          {recentSubscriptions.map((s) => (
            <div
              key={s._id}
              className="bg-gray-900 p-4 rounded-lg border border-white/10"
            >
              <p className="font-semibold">{s.plan?.name}</p>
              <p className="text-sm text-gray-400">
                Wallet: {s.user?.walletAddress}
              </p>
              <p className="text-sm text-gray-400">
                Status: {s.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default MerchantDashboard;
