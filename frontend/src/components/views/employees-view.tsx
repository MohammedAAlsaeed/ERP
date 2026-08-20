"use client";

import { columnHelperFor, type ErpColumns } from "@/components/data-table";
import type { FormField } from "@/components/entity-form";
import { ResourcePage } from "@/components/resource-page";
import { EmployeeStatusBadge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  employeeSchema,
  employeeStatusLabels,
  type Employee,
  type EmployeeInput,
} from "@/lib/types";

const helper = columnHelperFor<Employee>();

const buildColumns = (onDelete: (id: string) => void): ErpColumns<Employee> =>
  helper.columns([
    helper.accessor("name", {
      header: "الاسم",
      cell: (info) => <span className="font-medium text-ink">{info.getValue()}</span>,
    }),
    helper.accessor("position", { header: "المسمى الوظيفي" }),
    helper.accessor("department", { header: "الإدارة" }),
    helper.accessor("salary", {
      header: "الراتب",
      cell: (info) => <span className="tabular">{formatCurrency(info.getValue())}</span>,
    }),
    helper.accessor("hireDate", {
      header: "تاريخ التعيين",
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.accessor("status", {
      header: "الحالة",
      cell: (info) => <EmployeeStatusBadge status={info.getValue()} />,
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <DeleteButton
          label={`حذف ${info.row.original.name}`}
          onClick={() => onDelete(info.row.original.id)}
        />
      ),
    }),
  ]);

const fields: FormField<EmployeeInput>[] = [
  { name: "name", label: "اسم الموظف", wide: true },
  { name: "position", label: "المسمى الوظيفي" },
  { name: "department", label: "الإدارة" },
  { name: "salary", label: "الراتب الشهري", type: "number" },
  { name: "hireDate", label: "تاريخ التعيين", type: "date" },
  {
    name: "status",
    label: "الحالة",
    options: Object.entries(employeeStatusLabels).map(([value, label]) => ({
      value,
      label,
    })),
  },
];

export function EmployeesView() {
  return (
    <ResourcePage<Employee, EmployeeInput>
      collection="employees"
      title="الموظفون"
      subtitle="بيانات الكادر الوظيفي والرواتب"
      addLabel="إضافة موظف"
      emptyLabel="لا يوجد موظفون مطابقون للبحث"
      searchPlaceholder="ابحث بالاسم أو الإدارة…"
      buildColumns={buildColumns}
      schema={employeeSchema}
      fields={fields}
      defaultValues={{
        name: "",
        position: "",
        department: "",
        salary: 0,
        hireDate: "",
        status: "active",
      }}
    />
  );
}
