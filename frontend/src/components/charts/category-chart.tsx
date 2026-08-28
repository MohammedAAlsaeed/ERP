"use client";

import { formatCurrency } from "@/lib/format";
import { useVizTheme } from "@/lib/viz";
import type { Stats } from "@/lib/types";

/* Magnitude, not identity → one sequential hue, darker = larger. Built in plain
   HTML rather than an SVG chart: the bars grow right → left with the reading
   direction, and every value is direct-labelled at the tip, so the chart needs
   no legend, no gridlines and no tooltip. */
export function CategoryChart({ categories }: { categories: Stats["categories"] }) {
  const { theme } = useVizTheme();
  const data = categories.slice(0, 6);
  const max = Math.max(...data.map((entry) => entry.sales), 1);

  if (data.length === 0) {
    return <p className="px-5 py-6 text-sm text-ink-3">لا توجد مبيعات مسجلة بعد</p>;
  }

  return (
    <ul className="flex flex-col gap-3 px-5 py-5">
      {data.map((entry, index) => (
        <li key={entry.category} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs text-ink-2" title={entry.category}>
            {entry.category}
          </span>

          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className="h-5 rounded-e-[4px]"
              style={{
                width: `${Math.max((entry.sales / max) * 100, 1)}%`,
                backgroundColor:
                  theme.sequential[Math.min(index, theme.sequential.length - 1)],
              }}
            />
            <span className="tabular shrink-0 text-xs text-ink-2">
              {formatCurrency(entry.sales)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
