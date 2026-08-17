import type { Metadata } from "next";

import { InvoicesView } from "@/components/views/invoices-view";

export const metadata: Metadata = { title: "الفواتير | ERP" };

export default function Page() {
  return <InvoicesView />;
}
