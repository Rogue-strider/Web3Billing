import React, { useEffect, useState } from "react";
import api from "../../services/api";

const MerchantPlans = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    interval: "monthly",
  });

  const fetchPlans = async () => {
    const res = await api.get("/merchant/plans");
    setPlans(res.data.plans);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const createPlan = async (e) => {
    e.preventDefault();
    await api.post("/merchant/plans", form);
    setForm({ name: "", description: "", price: "", interval: "monthly" });
    fetchPlans();
  };

  const togglePlan = async (id) => {
    await api.patch(`/merchant/plans/${id}/toggle`);
    fetchPlans();
  };

  return (
    <div className="min-h-screen px-6 pt-24 text-white">
      <h1 className="text-4xl font-bold mb-8">Merchant Plans</h1>

      {/* CREATE PLAN */}
      <form
        onSubmit={createPlan}
        className="bg-gray-900 p-6 rounded-xl mb-10 space-y-4"
      >
        <input
          placeholder="Plan Name"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <input
          placeholder="Price"
          type="number"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <select
          className="w-full p-2 bg-gray-800 rounded"
          value={form.interval}
          onChange={(e) => setForm({ ...form, interval: e.target.value })}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <button className="bg-purple-600 px-6 py-2 rounded">
          Create Plan
        </button>
      </form>

      {/* PLAN LIST */}
      <div className="grid gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-gray-900 p-6 rounded-xl flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p>${plan.price} / {plan.interval}</p>
              <p>Status: {plan.isActive ? "Active" : "Inactive"}</p>
            </div>

            <button
              onClick={() => togglePlan(plan._id)}
              className="bg-red-600 px-4 py-2 rounded"
            >
              Toggle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantPlans;
