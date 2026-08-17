"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, FileText, Users, Wallet } from "lucide-react";

import { CategoryChart } from "@/components/charts/category-chart";
import { InvoiceStatusBar } from "@/components/charts/status-bar";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { StatTile } from "@/components/stat-tile";
import { Card, CardHeader } from "@/components/ui/card";
import { ErrorState, Loading } from "@/components/ui/states";
import { fetchStats, queryKeys } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/format";

export function DashboardView() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.stats,
    queryFn: fetchStats,
  });

  if (isPending) {
    return (
      <Card>
        <Loading />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <ErrorState message={error.message} />
      </Card>
    );
  }

  const { kpis, monthly, categories, invoiceStatus, lowStock } = data;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="إيرادات الشهر حتى اليوم"
          value={formatCurrency(kpis.revenue)}
          change={kpis.revenueChange}
          icon={Wallet}
        />
        <StatTile
          label="فواتير الشهر حتى اليوم"
          value={formatNumber(kpis.orders)}
          change={kpis.ordersChange}
          icon={FileText}
        />
        <StatTile
          label="إجمالي العملاء"
          value={formatNumber(kpis.customers)}
          note={`${formatNumber(kpis.newCustomers)} عميل جديد هذا الشهر`}
          icon={Users}
        />
        <StatTile
          label="مبالغ متأخرة"
          value={formatCurrency(kpis.overdue)}
          note={`${formatNumber(kpis.overdueCount)} فاتورة متأخرة`}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="الإيرادات والمصروفات"
            subtitle="آخر ١٢ شهرًا"
          />
          <RevenueChart monthly={monthly} />
        </Card>

        <Card>
          <CardHeader title="حالة الفواتير" subtitle="التوزيع الحالي" />
          <InvoiceStatusBar invoiceStatus={invoiceStatus} />
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="المبيعات حسب التصنيف" subtitle="إجمالي قيمة المبيعات" />
          <CategoryChart categories={categories} />
        </Card>

        <Card>
          <CardHeader
            title="مخزون منخفض"
            subtitle="أصناف وصلت حد إعادة الطلب"
          />
          <LowStockList items={lowStock} />
        </Card>
      </div>
    </div>
  );
}

/* A ratio against a limit reads best as a meter, not a chart. */
function LowStockList({
  items,
}: {
  items: { name: string; stock: number; reorderLevel: number }[];
}) {
  if (items.length === 0) {
    return <p className="px-5 py-6 text-sm text-ink-3">كل الأصناف فوق حد إعادة الطلب</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-line">
      {items.slice(0, 6).map((item) => {
        const ratio = Math.min(item.stock / Math.max(item.reorderLevel, 1), 1);
        const critical = item.stock === 0;

        return (
          <li key={item.name} className="px-5 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-ink">{item.name}</span>
              {/* Spelled out rather than "5 / 20": a bare slash between two
                  numbers flips order in an RTL paragraph. */}
              <span className="text-xs text-ink-2">
                المتوفر <span className="tabular">{formatNumber(item.stock)}</span> من حد{" "}
                <span className="tabular">{formatNumber(item.reorderLevel)}</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className={critical ? "h-full bg-critical" : "h-full bg-warning"}
                style={{ width: `${Math.max(ratio * 100, 4)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
