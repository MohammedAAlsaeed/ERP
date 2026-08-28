"use client";

import { useQuery } from "@tanstack/react-query";
import { Coins, PiggyBank, Receipt } from "lucide-react";

import { CategoryChart } from "@/components/charts/category-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { StatTile } from "@/components/stat-tile";
import { Card, CardHeader } from "@/components/ui/card";
import { ErrorState, Loading } from "@/components/ui/states";
import { fetchStats, queryKeys } from "@/lib/api";
import { formatCurrency, formatMonth } from "@/lib/format";

export function ReportsView() {
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

  const { monthly, categories, invoiceStatus } = data;
  const revenue = monthly.reduce((sum, month) => sum + month.revenue, 0);
  const expenses = monthly.reduce((sum, month) => sum + month.expenses, 0);
  const invoiceCount = invoiceStatus.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="إيرادات ١٢ شهرًا"
          value={formatCurrency(revenue)}
          note="مجموع الفواتير غير المسودة"
          icon={Coins}
        />
        <StatTile
          label="صافي الربح التقديري"
          value={formatCurrency(revenue - expenses)}
          note="الإيرادات ناقص المصروفات"
          icon={PiggyBank}
        />
        <StatTile
          label="متوسط قيمة الفاتورة"
          value={formatCurrency(invoiceCount === 0 ? 0 : Math.round(revenue / invoiceCount))}
          note="على أساس كل الفواتير"
          icon={Receipt}
        />
      </div>

      <Card>
        <CardHeader title="الإيرادات والمصروفات" subtitle="آخر ١٢ شهرًا" />
        <RevenueChart monthly={monthly} />
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="المبيعات حسب التصنيف" subtitle="إجمالي قيمة المبيعات" />
          <CategoryChart categories={categories} />
        </Card>

        {/* The same numbers as the line chart, as a table. */}
        <Card>
          <CardHeader title="التفصيل الشهري" subtitle="القيم الكاملة" />
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-3 text-xs font-medium text-ink-3">
                    الشهر
                  </th>
                  <th scope="col" className="px-5 py-3 text-xs font-medium text-ink-3">
                    الإيرادات
                  </th>
                  <th scope="col" className="px-5 py-3 text-xs font-medium text-ink-3">
                    المصروفات
                  </th>
                  <th scope="col" className="px-5 py-3 text-xs font-medium text-ink-3">
                    الصافي
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...monthly].reverse().map((month) => {
                  const net = month.revenue - month.expenses;

                  return (
                    <tr key={month.month} className="border-b border-line last:border-0">
                      <td className="px-5 py-2.5 text-ink">{formatMonth(month.month)}</td>
                      <td className="tabular px-5 py-2.5 text-ink-2">
                        {formatCurrency(month.revenue)}
                      </td>
                      <td className="tabular px-5 py-2.5 text-ink-2">
                        {formatCurrency(month.expenses)}
                      </td>
                      <td
                        className={`tabular px-5 py-2.5 ${net < 0 ? "text-critical" : "text-ink-2"}`}
                      >
                        {formatCurrency(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
