"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/calculations";

const COLORS = ["#1B3A6B", "#12A876"];

export function PaymentBreakdownChart({ principal, interest }: { principal: number; interest: number }) {
  const data = [
    { name: "Principal", value: principal },
    { name: "Total interest", value: interest },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
