"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AmortizationRow, formatCurrency } from "@/lib/calculations";

const COLORS = ["#1B3A6B", "#12A876", "#DE9A34"];

interface ScenarioSeries {
  label: string;
  rows: AmortizationRow[];
  paymentsPerYear: number;
  startingBalance: number;
}

export function MultiScenarioBalanceChart({ scenarios }: { scenarios: ScenarioSeries[] }) {
  const maxYears = Math.max(
    1,
    ...scenarios.map((s) => Math.ceil(s.rows.length / s.paymentsPerYear))
  );

  const data = Array.from({ length: maxYears + 1 }, (_, year) => {
    const point: Record<string, number> = { year };
    scenarios.forEach((s) => {
      if (year === 0) {
        point[s.label] = s.startingBalance;
        return;
      }
      const periodIndex = Math.min(year * s.paymentsPerYear, s.rows.length) - 1;
      point[s.label] = periodIndex >= 0 ? s.rows[periodIndex]?.balance ?? 0 : 0;
    });
    return point;
  });

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#E2E6EE" vertical={false} />
          <XAxis
            dataKey="year"
            tickFormatter={(y) => `Yr ${y}`}
            tick={{ fontSize: 12, fill: "#7C8697" }}
            axisLine={{ stroke: "#E2E6EE" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fontSize: 11, fill: "#7C8697" }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(y) => `Year ${y}`}
            contentStyle={{ borderRadius: 10, borderColor: "#E2E6EE", fontSize: 13 }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          {scenarios.map((s, i) => (
            <Line
              key={s.label}
              type="monotone"
              dataKey={s.label}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2.5}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
