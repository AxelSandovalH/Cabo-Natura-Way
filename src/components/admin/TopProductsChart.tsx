"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface ProductData {
  name: string;
  qty: number;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-[13px]">
      <p className="font-semibold text-gray-700">{payload[0]?.payload?.name}</p>
      <p className="text-[#2D5016] font-bold">{payload[0]?.value} units sold</p>
    </div>
  );
}

const COLORS = [
  "#2D5016", "#3D6B1F", "#4E8228", "#C4602A",
  "#E8A838", "#A89880",
];

export default function TopProductsChart({ data }: { data: ProductData[] }) {
  if (!data.length) {
    return (
      <div className="h-44 flex items-center justify-center text-gray-300 text-[13px]">
        No sales data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#A89880" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: "#6B5B4B" }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(45,80,22,.04)" }} />
        <Bar dataKey="qty" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
