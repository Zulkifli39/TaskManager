import React from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell} from "recharts";

const CustomBarChart = ({data}) => {
  // 🎨 Warna batang berdasarkan priority
  const getBarColor = (entry) => {
    switch (entry?.priority?.toLowerCase()) {
      case "low":
        return "#00BC7D"; // hijau
      case "medium":
        return "#FE9900"; // oranye
      case "high":
        return "#FF1F57"; // merah
      default:
        return "#999999"; // abu-abu default
    }
  };

  // 🧾 Custom tooltip
  const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-200">
          <p className="text-xs font-semibold text-gray-800 mb-1">Priority: {payload[0].payload.priority}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium">{payload[0].payload.count}</span>
          </p>
        </div>
      );
    }
    return null; // harus kembalikan null kalau tidak aktif
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{top: 10, right: 20, left: 0, bottom: 10}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="priority" tick={{fontSize: 12, fill: "#555"}} />
          <YAxis tick={{fontSize: 12, fill: "#555"}} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: "rgba(0,0,0,0.05)"}} />
          <Legend />

          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
