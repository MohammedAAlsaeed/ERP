import type { Metadata } from "next";

import { ReportsView } from "@/components/views/reports-view";

export const metadata: Metadata = { title: "التقارير | ERP" };

export default function Page() {
  return <ReportsView />;
}
