import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

/* Latin digits inside an Arabic locale: easier to scan in tables and charts. */
const currency = new Intl.NumberFormat("ar-SA-u-nu-latn", {
  style: "currency",
  currency: "SAR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("ar-SA-u-nu-latn");

const compact = new Intl.NumberFormat("ar-SA-u-nu-latn", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCurrency = (value: number) => currency.format(value);
export const formatNumber = (value: number) => number.format(value);
export const formatCompact = (value: number) => compact.format(value);

export const formatPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${number.format(value)}%`;

/** `2026-08-17` → `17 أغسطس 2026` */
export const formatDate = (value: string) =>
  format(parseISO(value), "d MMMM yyyy", { locale: ar });

/** `2026-08` → `أغسطس` (chart axis ticks) */
export const formatMonth = (value: string) =>
  format(parseISO(`${value}-01`), "MMM", { locale: ar });
