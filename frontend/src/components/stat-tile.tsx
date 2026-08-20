import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatPercent } from "@/lib/format";

/* Stat tile: label · value · optional delta. A single headline number is a
   figure, not a one-bar chart. */
export function StatTile({
  label,
  value,
  change,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: number;
  note?: string;
  icon: LucideIcon;
}) {
  const positive = (change ?? 0) >= 0;
  const Trend = positive ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs text-ink-2">{label}</span>
        <Icon size={16} className="text-ink-3" aria-hidden />
      </div>

      <p className="tabular mt-3 text-2xl font-semibold text-ink">{value}</p>

      {change !== undefined ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs">
          <Trend
            size={14}
            aria-hidden
            className={positive ? "text-good" : "text-critical"}
          />
          <span className={positive ? "text-good" : "text-critical"}>
            {formatPercent(change)}
          </span>
          <span className="text-ink-3">مقارنة بالشهر السابق</span>
        </p>
      ) : note ? (
        <p className="mt-2 text-xs text-ink-3">{note}</p>
      ) : null}
    </div>
  );
}
