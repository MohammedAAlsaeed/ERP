"use client";

import { formatCurrency } from "@/lib/format";

type TooltipRow = { name?: string; value?: number; color?: string };

/* Shared tooltip: values wear text tokens, identity comes from the swatch
   beside them — never from colouring the text itself. */
export function ChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: readonly TooltipRow[];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 shadow-lg">
      {label ? (
        <p className="mb-1.5 text-xs font-medium text-ink">{label}</p>
      ) : null}
      <ul className="flex flex-col gap-1">
        {payload.map((row) => (
          <li key={row.name} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: row.color }}
            />
            <span className="text-ink-2">{row.name}</span>
            <span className="tabular font-medium text-ink">
              {formatCurrency(row.value ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Legend built in HTML so the swatch/label pairing is always present. */
export function ChartLegend({
  items,
}: {
  items: { label: string; color: string; value?: string }[];
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-0.5 w-4 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-ink-2">{item.label}</span>
          {item.value ? (
            <span className="tabular text-xs font-medium text-ink">{item.value}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
