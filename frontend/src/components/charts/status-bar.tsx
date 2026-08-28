"use client";

import { formatCurrency, formatNumber } from "@/lib/format";
import { invoiceStatusLabels, type Stats } from "@/lib/types";
import { invoiceStatusColor, useVizTheme } from "@/lib/viz";

/* Part-to-whole → one stacked horizontal bar. Segments are separated by a 2px
   surface gap rather than a border, and every segment is named in the list
   below, so status is never carried by colour alone. */
export function InvoiceStatusBar({ invoiceStatus }: { invoiceStatus: Stats["invoiceStatus"] }) {
  const { theme } = useVizTheme();
  const segments = invoiceStatus.filter((entry) => entry.count > 0);
  const total = segments.reduce((sum, entry) => sum + entry.count, 0);

  if (total === 0) {
    return <p className="px-5 py-6 text-sm text-ink-3">لا توجد فواتير بعد</p>;
  }

  return (
    <div className="px-5 py-5">
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
        {segments.map((entry) => (
          <span
            key={entry.status}
            title={`${invoiceStatusLabels[entry.status]}: ${formatNumber(entry.count)}`}
            style={{
              width: `${(entry.count / total) * 100}%`,
              backgroundColor: theme.status[invoiceStatusColor[entry.status]],
            }}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {segments.map((entry) => (
          <li key={entry.status} className="flex items-center gap-2.5 text-xs">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: theme.status[invoiceStatusColor[entry.status]] }}
            />
            <span className="text-ink-2">{invoiceStatusLabels[entry.status]}</span>
            <span className="tabular text-ink-3">
              {formatNumber(entry.count)} فاتورة
            </span>
            <span className="tabular mr-auto font-medium text-ink">
              {formatCurrency(entry.total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
