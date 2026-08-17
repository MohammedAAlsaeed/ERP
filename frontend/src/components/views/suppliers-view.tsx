"use client";

import { columnHelperFor, type ErpColumns } from "@/components/data-table";
import type { FormField } from "@/components/entity-form";
import { ResourcePage } from "@/components/resource-page";
import { DeleteButton } from "@/components/ui/delete-button";
import { formatCurrency } from "@/lib/format";
import { supplierSchema, type Supplier, type SupplierInput } from "@/lib/types";

const helper = columnHelperFor<Supplier>();

const buildColumns = (onDelete: (id: string) => void): ErpColumns<Supplier> =>
  helper.columns([
    helper.accessor("name", {
      header: "المورد",
      cell: (info) => <span className="font-medium text-ink">{info.getValue()}</span>,
    }),
    helper.accessor("category", { header: "التصنيف" }),
    helper.accessor("phone", {
      header: "الهاتف",
      cell: (info) => <span className="tabular">{info.getValue()}</span>,
    }),
    helper.accessor("city", { header: "المدينة" }),
    helper.accessor("balance", {
      header: "المستحقات",
      cell: (info) => <span className="tabular">{formatCurrency(info.getValue())}</span>,
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

const fields: FormField<SupplierInput>[] = [
  { name: "name", label: "اسم المورد", wide: true },
  { name: "category", label: "التصنيف" },
  { name: "phone", label: "رقم الهاتف", type: "tel" },
  { name: "city", label: "المدينة" },
  { name: "balance", label: "المستحقات الحالية", type: "number" },
];

export function SuppliersView() {
  return (
    <ResourcePage<Supplier, SupplierInput>
      collection="suppliers"
      title="الموردون"
      subtitle="جهات التوريد والمستحقات المسجلة"
      addLabel="إضافة مورد"
      emptyLabel="لا يوجد موردون مطابقون للبحث"
      searchPlaceholder="ابحث بالاسم أو التصنيف…"
      buildColumns={buildColumns}
      schema={supplierSchema}
      fields={fields}
      defaultValues={{ name: "", category: "", phone: "", city: "", balance: 0 }}
    />
  );
}
