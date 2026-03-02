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
      await togglePlanStatus(planId);

      await loadPlans();

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
