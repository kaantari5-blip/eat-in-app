"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type SalesChartProps = {
  data: {
    date: string;
    sales: number;
    revenue: number;
  }[];
};

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <section className="rounded-[1.5rem] border border-[#E8D7C7] bg-white p-5 shadow">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[#8A7768]">
          Son 7 Gün
        </p>
        <h2 className="mt-1 text-xl font-bold text-[#2B1E16]">
          Satış Grafiği
        </h2>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" name="Satış" strokeWidth={3} />
            <Line type="monotone" dataKey="revenue" name="Gelir ₺" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}