"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartLegend, ChartTooltip } from "@/components/charts/chart-parts";
import { formatCompact, formatCurrency, formatMonth } from "@/lib/format";
import { useVizTheme } from "@/lib/viz";
import type { Stats } from "@/lib/types";

/* Two series → categorical slots 1 and 2, a legend that is always present, and
   the latest value direct-labelled next to each label in the legend. Time runs
   right → left to match the reading direction. */
export function RevenueChart({ monthly }: { monthly: Stats["monthly"] }) {
  const { theme } = useVizTheme();
  const latest = monthly[monthly.length - 1];

  const data = monthly.map((entry) => ({
    ...entry,
    label: formatMonth(entry.month),
  }));

  return (
    <div>
      <div className="px-5 pt-4">
        <ChartLegend
          items={[
            {
              label: "الإيرادات",
              color: theme.series[0],
              value: formatCurrency(latest.revenue),
            },
            {
              label: "المصروفات",
              color: theme.series[1],
              value: formatCurrency(latest.expenses),
            },
          ]}
        />
      </div>

      <div className="h-72 px-2 pt-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid stroke={theme.grid} strokeWidth={1} vertical={false} />
            <XAxis
              dataKey="label"
              reversed
              tickLine={false}
              axisLine={{ stroke: theme.grid }}
              tick={{ fill: theme.axis, fontSize: 11 }}
              tickMargin={8}
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fill: theme.axis, fontSize: 11 }}
              tickFormatter={(value: number) => formatCompact(value)}
              width={56}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: theme.axis, strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="الإيرادات"
              stroke={theme.series[0]}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: theme.surface }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="المصروفات"
              stroke={theme.series[1]}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: theme.surface }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
