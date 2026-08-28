"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { columnHelperFor, DataTable, type ErpColumns } from "@/components/data-table";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { InvoiceStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { Modal } from "@/components/ui/modal";
import { ErrorState, Loading } from "@/components/ui/states";
import {
  createRecord,
  deleteRecord,
  listRecords,
  queryKeys,
} from "@/lib/api";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { Invoice, InvoiceInput } from "@/lib/types";

const EMPTY: Invoice[] = [];
const helper = columnHelperFor<Invoice>();

const buildColumns = (onDelete: (id: string) => void): ErpColumns<Invoice> =>
  helper.columns([
    helper.accessor("number", {
      header: "رقم الفاتورة",
      cell: (info) => (
        <span className="tabular font-medium text-ink">{info.getValue()}</span>
      ),
    }),
    helper.accessor("customerName", { header: "العميل" }),
    helper.accessor("date", {
      header: "التاريخ",
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.accessor("dueDate", {
      header: "الاستحقاق",
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.accessor((row) => row.items.length, {
      id: "itemCount",
      header: "البنود",
      cell: (info) => <span className="tabular">{formatNumber(info.getValue())}</span>,
    }),
    helper.accessor("total", {
      header: "الإجمالي",
      cell: (info) => <span className="tabular">{formatCurrency(info.getValue())}</span>,
    }),
    helper.accessor("status", {
      header: "الحالة",
      cell: (info) => <InvoiceStatusBadge status={info.getValue()} />,
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <DeleteButton
          label={`حذف الفاتورة ${info.row.original.number}`}
          onClick={() => onDelete(info.row.original.id)}
        />
      ),
    }),
  ]);

export function InvoicesView() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);

  const invoices = useQuery({
    queryKey: queryKeys.list("invoices"),
    queryFn: () => listRecords("invoices"),
  });

  // Fills the customer picker in the form.
  const customers = useQuery({
    queryKey: queryKeys.list("customers"),
    queryFn: () => listRecords("customers"),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.list("invoices") });
    queryClient.invalidateQueries({ queryKey: queryKeys.stats });
  }, [queryClient]);

  const create = useMutation({
    mutationFn: (values: InvoiceInput) => createRecord("invoices", values),
    onSuccess: () => {
      invalidate();
      setFormOpen(false);
    },
  });

  const destroy = useMutation({
    mutationFn: (id: string) => deleteRecord("invoices", id),
    onSuccess: invalidate,
  });

  const onDelete = useCallback(
    (id: string) => {
      if (window.confirm("هل تريد حذف هذه الفاتورة؟")) destroy.mutate(id);
    },
    [destroy],
  );

  const columns = useMemo(() => buildColumns(onDelete), [onDelete]);
  const customerOptions = useMemo(
    () => (customers.data ?? []).map(({ id, name }) => ({ id, name })),
    [customers.data],
  );

  return (
    <>
      <Card>
        <CardHeader
          title="الفواتير"
          subtitle="فواتير البيع وحالات التحصيل"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={15} aria-hidden />
              فاتورة جديدة
            </Button>
          }
        />

        {invoices.isPending ? (
          <Loading />
        ) : invoices.isError ? (
          <ErrorState message={invoices.error.message} />
        ) : (
          <DataTable
            data={invoices.data ?? EMPTY}
            columns={columns}
            emptyLabel="لا توجد فواتير مطابقة للبحث"
            searchPlaceholder="ابحث برقم الفاتورة أو العميل…"
          />
        )}
      </Card>

      <Modal title="فاتورة جديدة" open={formOpen} onClose={() => setFormOpen(false)}>
        {/* Remounted per open so the line items reset with a fresh form. */}
        <InvoiceForm
          key={formOpen ? "open" : "closed"}
          customers={customerOptions}
          pending={create.isPending}
          error={create.isError ? create.error.message : undefined}
          onSubmit={(values) => create.mutate(values)}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </>
  );
}
