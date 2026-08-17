"use client";

import { columnHelperFor, type ErpColumns } from "@/components/data-table";
import type { FormField } from "@/components/entity-form";
import { ResourcePage } from "@/components/resource-page";
import { DeleteButton } from "@/components/ui/delete-button";
import { formatCurrency, formatDate } from "@/lib/format";
import { customerSchema, type Customer, type CustomerInput } from "@/lib/types";

const helper = columnHelperFor<Customer>();

// Module scope keeps the identity stable across renders, so the table's row
// models are not rebuilt on every keystroke.
const buildColumns = (onDelete: (id: string) => void): ErpColumns<Customer> =>
  helper.columns([
    helper.accessor("name", {
      header: "الاسم",
      cell: (info) => <span className="font-medium text-ink">{info.getValue()}</span>,
    }),
    helper.accessor("phone", {
      header: "الهاتف",
      cell: (info) => <span className="tabular">{info.getValue()}</span>,
    }),
    helper.accessor("email", { header: "البريد الإلكتروني" }),
    helper.accessor("city", { header: "المدينة" }),
    helper.accessor("balance", {
      header: "الرصيد",
      cell: (info) => <span className="tabular">{formatCurrency(info.getValue())}</span>,
    }),
    helper.accessor("createdAt", {
      header: "تاريخ الإضافة",
      cell: (info) => formatDate(info.getValue()),
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

const fields: FormField<CustomerInput>[] = [
  { name: "name", label: "اسم العميل" },
  { name: "phone", label: "رقم الهاتف", type: "tel" },
  { name: "email", label: "البريد الإلكتروني", type: "email" },
  { name: "city", label: "المدينة" },
  { name: "balance", label: "الرصيد الافتتاحي", type: "number" },
];

export function CustomersView() {
  return (
    <ResourcePage<Customer, CustomerInput>
      collection="customers"
      title="العملاء"
      subtitle="بيانات العملاء وأرصدتهم الحالية"
      addLabel="إضافة عميل"
      emptyLabel="لا يوجد عملاء مطابقون للبحث"
      searchPlaceholder="ابحث بالاسم أو المدينة…"
      buildColumns={buildColumns}
      schema={customerSchema}
      fields={fields}
      defaultValues={{ name: "", phone: "", email: "", city: "", balance: 0 }}
    />
  );
}
