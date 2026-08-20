"use client";

import { columnHelperFor, type ErpColumns } from "@/components/data-table";
import type { FormField } from "@/components/entity-form";
import { ResourcePage } from "@/components/resource-page";
import { DeleteButton } from "@/components/ui/delete-button";
import { formatCurrency, formatNumber } from "@/lib/format";
import { productSchema, type Product, type ProductInput } from "@/lib/types";

const helper = columnHelperFor<Product>();

const buildColumns = (onDelete: (id: string) => void): ErpColumns<Product> =>
  helper.columns([
    helper.accessor("sku", {
      header: "الرمز",
      cell: (info) => <span className="tabular text-ink-3">{info.getValue()}</span>,
    }),
    helper.accessor("name", {
      header: "المنتج",
      cell: (info) => <span className="font-medium text-ink">{info.getValue()}</span>,
    }),
    helper.accessor("category", { header: "التصنيف" }),
    helper.accessor("cost", {
      header: "التكلفة",
      cell: (info) => <span className="tabular">{formatCurrency(info.getValue())}</span>,
    }),
    helper.accessor("price", {
      header: "سعر البيع",
      cell: (info) => <span className="tabular">{formatCurrency(info.getValue())}</span>,
    }),
    helper.accessor("stock", {
      header: "المخزون",
      cell: (info) => {
        const { stock, reorderLevel } = info.row.original;
        const low = stock <= reorderLevel;

        return (
          <span
            className={`tabular ${low ? "font-medium text-critical" : ""}`}
            title={low ? "وصل حد إعادة الطلب" : undefined}
          >
            {formatNumber(stock)}
            {low ? " ⚠︎" : ""}
          </span>
        );
      },
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

const fields: FormField<ProductInput>[] = [
  { name: "name", label: "اسم المنتج", wide: true },
  { name: "sku", label: "رمز المنتج (SKU)" },
  { name: "category", label: "التصنيف" },
  { name: "cost", label: "سعر التكلفة", type: "number" },
  { name: "price", label: "سعر البيع", type: "number" },
  { name: "stock", label: "الكمية المتوفرة", type: "number" },
  { name: "reorderLevel", label: "حد إعادة الطلب", type: "number" },
];

export function ProductsView() {
  return (
    <ResourcePage<Product, ProductInput>
      collection="products"
      title="المنتجات والمخزون"
      subtitle="الأصناف والأسعار والكميات المتوفرة"
      addLabel="إضافة منتج"
      emptyLabel="لا توجد منتجات مطابقة للبحث"
      searchPlaceholder="ابحث بالاسم أو الرمز…"
      buildColumns={buildColumns}
      schema={productSchema}
      fields={fields}
      defaultValues={{
        sku: "",
        name: "",
        category: "",
        cost: 0,
        price: 0,
        stock: 0,
        reorderLevel: 20,
      }}
    />
  );
}
