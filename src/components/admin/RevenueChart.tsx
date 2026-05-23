"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

interface DataPoint {
  day: string;
  revenue: number;
  orders: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-[13px]">
      <p className="font-semibold text-gray-600 mb-1">{label}</p>
      <p className="font-bold text-[#2D5016]">${payload[0]?.value?.toFixed(2)}</p>
      <p className="text-gray-400">{payload[1]?.value} order{payload[1]?.value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  const hasData = data.some((d) => d.revenue > 0);

  if (!hasData) {
    return (
      <div className="h-52 flex items-center justify-center text-gray-300 text-[13px]">
        No revenue data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#2D5016" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2D5016" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#A89880" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#A89880" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2D5016"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#2D5016" }}
        />
        {/* invisible line just to expose orders in tooltip */}
        <Area
          type="monotone"
          dataKey="orders"
          stroke="transparent"
          fill="transparent"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
