// import React, { useContext, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { WalletContext } from "../../contexts/WalletContext";
// import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
// import {
//   getMySubscriptions,
//   cancelSubscription,
// } from "../../services/subscription.service";
// import toast from "react-hot-toast";

// const Dashboard = () => {
//   const { isConnected, authReady } = useContext(WalletContext);

//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loadingSubs, setLoadingSubs] = useState(false);

//   /* =======================
//      FAKE STATS (for now)
//   ======================= */
//   const stats = [
//     {
//       icon: DollarSign,
//       label: "Total Revenue",
//       value: "$12,450",
//       change: "+12.5%",
//       color: "from-green-500 to-emerald-500",
//     },
//     {
//       icon: Users,
//       label: "Active Subscribers",
//       value: "234",
//       change: "+8.2%",
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       icon: TrendingUp,
//       label: "MRR",
//       value: "$3,200",
//       change: "+15.3%",
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       icon: Activity,
//       label: "Churn Rate",
//       value: "2.1%",
//       change: "-1.2%",
//       color: "from-orange-500 to-red-500",
//     },
//   ];

//   /* =======================
//      LOAD SUBSCRIPTIONS
//   ======================= */
//   useEffect(() => {
//     if (!isConnected || !authReady) return;

//     const loadSubs = async () => {
//       try {
//         setLoadingSubs(true);

//         const res = await getMySubscriptions();

//         const subs = res?.data?.subscriptions || [];

//         setSubscriptions(Array.isArray(subs) ? subs : []);
//       } catch (err) {
//         console.error("Load subs error:", err);
//         setSubscriptions([]);
//         if (err?.response?.status !== 401) {
//           toast.error("Failed to load subscriptions");
//         }
//       } finally {
//         setLoadingSubs(false);
//       }
//     };

//     loadSubs();
//   }, [isConnected, authReady]);
//   /* =======================
//      CANCEL HANDLER (STEP 3)
//   ======================= */
//   const handleCancel = async (sub) => {
//     try {
//       await cancelSubscription(sub._id);

//       toast.success("Subscription will cancel at period end");

//       // optimistic UI update
//       setSubscriptions((prev) =>
//         prev.map((s) =>
//           s._id === sub._id ? { ...s, cancelAtPeriodEnd: true } : s
//         )
//       );
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Cancel failed");
//     }
//   };

//   /* =======================
//      NOT CONNECTED UI
//   ======================= */
//   if (!isConnected) {
//     return (
//       <div className="min-h-screen flex items-center justify-center px-6 pt-20">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <div className="text-6xl mb-4">🔐</div>
//           <h2 className="text-3xl font-bold text-white mb-4">
//             Connect Your Wallet
//           </h2>
//           <p className="text-gray-400">
//             Please connect your wallet to access the dashboard
//           </p>
//         </motion.div>
//       </div>
//     );
//   }

//   /* =======================
//      DASHBOARD UI
//   ======================= */
//   return (
//     <div className="min-h-screen px-6 pt-28 pb-12 text-white">
//       <div className="container mx-auto max-w-7xl">
//         {/* HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-12"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
//           <p className="text-gray-400">Welcome back! Here's your overview.</p>
//         </motion.div>

//         {/* STATS GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {stats.map((stat, idx) => {
//             const Icon = stat.icon;
//             return (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 whileHover={{ y: -5 }}
//                 className="relative group"
//               >
//                 <div
//                   className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-30 group-hover:opacity-50`}
//                 />
//                 <div className="relative bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10">
//                   <div className="flex items-center justify-between mb-4">
//                     <div
//                       className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}
//                     >
//                       <Icon size={24} />
//                     </div>
//                     <span
//                       className={`text-sm font-semibold ${
//                         stat.change.startsWith("+")
//                           ? "text-green-400"
//                           : "text-red-400"
//                       }`}
//                     >
//                       {stat.change}
//                     </span>
//                   </div>
//                   <div className="text-3xl font-bold mb-1">{stat.value}</div>
//                   <div className="text-gray-400 text-sm">{stat.label}</div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* =======================
//             SUBSCRIPTIONS (STEP 4)
//         ======================= */}
//         <div className="mt-16">
//           <h2 className="text-3xl font-bold mb-6">My Subscriptions</h2>

//           {loadingSubs && (
//             <p className="text-gray-400">Loading subscriptions...</p>
//           )}

//           {!loadingSubs && subscriptions.length === 0 && (
//             <p className="text-gray-400">No subscriptions found</p>
//           )}

//           <div className="grid gap-6">
//             {subscriptions.map((sub) => (
//               <div
//                 key={sub._id}
//                 className="bg-gray-900 bg-opacity-50 border border-white border-opacity-10 rounded-xl p-6 flex justify-between items-center"
//               >
//                 <div>
//                   <p className="text-lg font-semibold">
//                     Plan: {sub.plan?.name || "Plan"}
//                   </p>
//                   <p className="text-sm text-gray-400">
//                     Status:{" "}
//                     {sub.cancelAtPeriodEnd
//                       ? "Cancels at period end"
//                       : sub.status}
//                   </p>
//                   <p className="text-sm text-gray-400">
//                     Ends: {new Date(sub.currentPeriodEnd).toLocaleString()}
//                   </p>
//                 </div>

//                 {sub.status === "active" && !sub.cancelAtPeriodEnd && (
//                   <button
//                     onClick={() => handleCancel(sub)}
//                     className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* COMING SOON */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="mt-20 bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-12 text-center border border-white border-opacity-20"
//         >
//           <div className="text-6xl mb-4">🚀</div>
//           <h2 className="text-3xl font-bold mb-4">
//             More Features Coming Soon!
//           </h2>
//           <p className="text-gray-300 max-w-2xl mx-auto">
//             Advanced analytics, plan management, earnings & more.
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WalletContext } from "../../contexts/WalletContext";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import {
  getMySubscriptions,
  cancelSubscription,
} from "../../services/subscription.service";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { isConnected, authReady } = useContext(WalletContext);

  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  /* =======================
     STATS (FAKE FOR NOW)
  ======================= */
  const stats = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: "$12,450",
      change: "+12.5%",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      label: "Active Subscribers",
      value: "234",
      change: "+8.2%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      label: "MRR",
      value: "$3,200",
      change: "+15.3%",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      label: "Churn Rate",
      value: "2.1%",
      change: "-1.2%",
      color: "from-orange-500 to-red-500",
    },
  ];

  /* =======================
     LOAD SUBSCRIPTIONS
  ======================= */
  useEffect(() => {
    if (!isConnected || !authReady) return;

    const loadSubs = async () => {
      try {
        setLoadingSubs(true);
        const res = await getMySubscriptions();
        const subs = res?.data?.subscriptions || [];
        setSubscriptions(Array.isArray(subs) ? subs : []);
      } catch (err) {
        console.error("Load subs error:", err);
        setSubscriptions([]);
        if (err?.response?.status !== 401) {
          toast.error("Failed to load subscriptions");
        }
      } finally {
        setLoadingSubs(false);
      }
    };

    loadSubs();
  }, [isConnected, authReady]);

  /* =======================
     SPLIT SUBSCRIPTIONS
  ======================= */
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active"
  );

  const expiredSubscriptions = subscriptions.filter(
    (sub) => sub.status === "expired"
  );
  const activeSubs = subscriptions.filter(
    (sub) => sub.status === "active" && sub.cancelAtPeriodEnd === false
  );

  const cancellingSubs = subscriptions.filter(
    (sub) => sub.status === "active" && sub.cancelAtPeriodEnd === true
  );

  const historySubs = subscriptions.filter(
    (sub) =>
      sub.status === "expired" ||
      (sub.status === "active" && sub.cancelAtPeriodEnd)
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
          s._id === sub._id ? { ...s, cancelAtPeriodEnd: true } : s
        )
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
          {stats.map((stat, idx) => {
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

        {/* =======================
            ACTIVE / CANCELLING
        ======================= */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">My Subscriptions</h2>

          {activeSubs.length === 0 && cancellingSubs.length === 0 && (
            <p className="text-gray-400">No active subscriptions</p>
          )}

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

                {/* ✅ Cancel button ONLY for usable subs */}
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

        {/* =======================
            SUBSCRIPTION HISTORY
        ======================= */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mt-16 mb-6">
            Subscription History
          </h2>

          {historySubs.length === 0 && (
            <p className="text-gray-400">No past subscriptions</p>
          )}

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

        {/* FOOTER */}
        {/* COMING SOON */}
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
