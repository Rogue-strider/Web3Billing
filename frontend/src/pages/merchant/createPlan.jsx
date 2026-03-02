import React, { useState } from "react";
import { createPlan } from "../../services/plan.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePlan = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    interval: "monthly",
    currency: "USDC",
    chain: "polygon",
  });

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     SUBMIT FORM
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPlan(form);

      toast.success("Plan created successfully");
      navigate("/merchant/plans");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create plan");
    }
  };

  return (
    <div className="min-h-screen px-6 pt-24 text-white">
      <h1 className="text-3xl font-bold mb-6">Create New Plan</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-gray-900 bg-opacity-50 p-6 rounded-xl space-y-4"
      >
        {/* PLAN NAME */}
        <input
          name="name"
          placeholder="Plan name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 bg-black rounded"
          required
        />

        {/* DESCRIPTION */}
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 bg-black rounded"
        />

        {/* PRICE */}
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-3 bg-black rounded"
          required
        />

        {/* INTERVAL */}
        <select
          name="interval"
          value={form.interval}
          onChange={handleChange}
          className="w-full p-3 bg-black rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {/* CHAIN */}
        <select
          name="chain"
          value={form.chain}
          onChange={handleChange}
          className="w-full p-3 bg-black rounded"
        >
          <option value="polygon">Polygon</option>
          <option value="ethereum">Ethereum</option>
          <option value="solana">Solana</option>
        </select>

        {/* CURRENCY */}
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="w-full p-3 bg-black rounded"
        >
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
        </select>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
        >
          Create Plan
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;