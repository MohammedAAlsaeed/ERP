import type { Metadata } from "next";

import { CustomersView } from "@/components/views/customers-view";

export const metadata: Metadata = { title: "العملاء | ERP" };

export default function CustomersPage() {
  return <CustomersView />;
}
