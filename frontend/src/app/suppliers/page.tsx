import type { Metadata } from "next";

import { SuppliersView } from "@/components/views/suppliers-view";

export const metadata: Metadata = { title: "الموردون | ERP" };

export default function Page() {
  return <SuppliersView />;
}
