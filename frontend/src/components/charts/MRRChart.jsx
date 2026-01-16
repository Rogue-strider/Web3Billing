import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MRRChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-400 text-sm">No data available</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#E5E7EB" }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#A855F7"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MRRChart;
