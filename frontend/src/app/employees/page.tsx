import type { Metadata } from "next";

import { EmployeesView } from "@/components/views/employees-view";

export const metadata: Metadata = { title: "الموظفون | ERP" };

export default function Page() {
  return <EmployeesView />;
}
