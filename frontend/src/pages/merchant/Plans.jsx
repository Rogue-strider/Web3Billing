// import React, { useEffect, useState } from "react";
// import api from "../../services/api";

// const MerchantPlans = () => {
//   const [plans, setPlans] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     interval: "monthly",
//   });

//   const fetchPlans = async () => {
//     const res = await api.get("/merchant/plans");
//     setPlans(res.data.plans);
//   };

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const createPlan = async (e) => {
//     e.preventDefault();
//     await api.post("/merchant/plans", form);
//     setForm({ name: "", description: "", price: "", interval: "monthly" });
//     fetchPlans();
//   };

//   const togglePlan = async (id) => {
//     await api.patch(`/merchant/plans/${id}/toggle`);
//     fetchPlans();
//   };

//   return (
//     <div className="min-h-screen px-6 pt-24 text-white">
//       <h1 className="text-4xl font-bold mb-8">Merchant Plans</h1>

//       {/* CREATE PLAN */}
//       <form
//         onSubmit={createPlan}
//         className="bg-gray-900 p-6 rounded-xl mb-10 space-y-4"
//       >
//         <input
//           placeholder="Plan Name"
//           className="w-full p-2 bg-gray-800 rounded"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         />
//         <input
//           placeholder="Description"
//           className="w-full p-2 bg-gray-800 rounded"
//           value={form.description}
//           onChange={(e) =>
//             setForm({ ...form, description: e.target.value })
//           }
//         />
//         <input
//           placeholder="Price"
//           type="number"
//           className="w-full p-2 bg-gray-800 rounded"
//           value={form.price}
//           onChange={(e) => setForm({ ...form, price: e.target.value })}
//           required
//         />
//         <select
//           className="w-full p-2 bg-gray-800 rounded"
//           value={form.interval}
//           onChange={(e) => setForm({ ...form, interval: e.target.value })}
//         >
//           <option value="monthly">Monthly</option>
//           <option value="yearly">Yearly</option>
//         </select>

//         <button className="bg-purple-600 px-6 py-2 rounded">
//           Create Plan
//         </button>
//       </form>

//       {/* PLAN LIST */}
//       <div className="grid gap-6">
//         {plans.map((plan) => (
//           <div
//             key={plan._id}
//             className="bg-gray-900 p-6 rounded-xl flex justify-between items-center"
//           >
//             <div>
//               <h2 className="text-xl font-semibold">{plan.name}</h2>
//               <p>${plan.price} / {plan.interval}</p>
//               <p>Status: {plan.isActive ? "Active" : "Inactive"}</p>
//             </div>

//             <button
//               onClick={() => togglePlan(plan._id)}
//               className="bg-red-600 px-4 py-2 rounded"
//             >
//               Toggle
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MerchantPlans;

import React, { useEffect, useState } from "react";
import { getMyPlans, togglePlanStatus } from "../../services/plan.service";
import toast from "react-hot-toast";

const MerchantPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD PLANS
  ========================= */
  const loadPlans = async () => {
    try {
      const res = await getMyPlans();
      setPlans(res.data.plans || []);
    } catch (err) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  /* =========================
     TOGGLE PLAN
  ========================= */
  const handleToggle = async (planId) => {
    try {
      const res = await togglePlanStatus(planId);
      setPlans((prev) =>
        prev.map((p) => (p._id === planId ? res.data.plan : p)),
      );

      toast.success("Plan status updated");
    } catch (err) {
      toast.error("Failed to update plan");
    }
  };

  return (
    <div className="min-h-screen px-6 pt-24 text-white">
      <h1 className="text-4xl font-bold mb-8">My Plans</h1>

      {loading ? (
        <p className="text-gray-400">Loading plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-gray-400">No plans created yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-gray-900 bg-opacity-50 backdrop-blur-lg border border-white border-opacity-10 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>

              <p className="text-gray-400 mb-2">{plan.description}</p>

              <p className="text-lg font-bold mb-2">
                ${plan.price} / {plan.interval}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    plan.isActive
                      ? "bg-green-600 bg-opacity-20 text-green-400"
                      : "bg-red-600 bg-opacity-20 text-red-400"
                  }`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>

                <button
                  onClick={() => handleToggle(plan._id)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
                >
                  Toggle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantPlans;
