"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm, useWatch, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { formatCurrency } from "@/lib/format";
import { invoiceSchema, invoiceStatusLabels, type InvoiceInput } from "@/lib/types";

const today = () => new Date().toISOString().slice(0, 10);

const inThirtyDays = () =>
  new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10);

const emptyItem = { description: "", quantity: 1, unitPrice: 0 };

export function InvoiceForm({
  customers,
  pending,
  error,
  onSubmit,
  onCancel,
}: {
  /** Ids keep the option list stable — customers may share a name. */
  customers: { id: string; name: string }[];
  pending: boolean;
  error?: string;
  onSubmit: (values: InvoiceInput) => void;
  onCancel: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema) as Resolver<InvoiceInput>,
    defaultValues: {
      customerName: customers[0]?.name ?? "",
      date: today(),
      dueDate: inThirtyDays(),
      status: "pending",
      items: [{ ...emptyItem }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Live total: the inputs are strings until zod coerces them on submit.
  const watchedItems = useWatch({ control, name: "items" });
  const total = (watchedItems ?? []).reduce(
    (sum, item) => sum + Number(item?.quantity ?? 0) * Number(item?.unitPrice ?? 0),
    0,
  );

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="العميل" error={errors.customerName?.message}>
            {customers.length > 0 ? (
              <Select {...register("customerName")}>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            ) : (
              <Input {...register("customerName")} placeholder="اسم العميل" />
            )}
          </Field>
        </div>

        <Field label="تاريخ الفاتورة" error={errors.date?.message}>
          <Input type="date" {...register("date")} />
        </Field>

        <Field label="تاريخ الاستحقاق" error={errors.dueDate?.message}>
          <Input type="date" {...register("dueDate")} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="الحالة" error={errors.status?.message}>
            <Select {...register("status")}>
              {Object.entries(invoiceStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-xs font-medium text-ink-2">بنود الفاتورة</legend>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  placeholder="الوصف"
                  aria-label={`وصف البند ${index + 1}`}
                  {...register(`items.${index}.description`)}
                />
                {errors.items?.[index]?.description ? (
                  <span className="mt-1 block text-xs text-critical">
                    {errors.items[index]?.description?.message}
                  </span>
                ) : null}
              </div>

              <div className="w-20">
                <Input
                  type="number"
                  min={1}
                  aria-label={`كمية البند ${index + 1}`}
                  {...register(`items.${index}.quantity`)}
                />
              </div>

              <div className="w-28">
                <Input
                  type="number"
                  step="any"
                  aria-label={`سعر البند ${index + 1}`}
                  {...register(`items.${index}.unitPrice`)}
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                aria-label={`حذف البند ${index + 1}`}
                className="mt-1.5 rounded-md p-1.5 text-ink-3 hover:text-critical disabled:opacity-30"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {errors.items?.message ? (
          <p className="mt-2 text-xs text-critical">{errors.items.message}</p>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          className="mt-3"
          onClick={() => append({ ...emptyItem })}
        >
          <Plus size={15} aria-hidden />
          إضافة بند
        </Button>
      </fieldset>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs text-ink-2">الإجمالي</span>
        <span className="tabular text-base font-semibold text-ink">
          {formatCurrency(total)}
        </span>
      </div>

      {error ? <p className="mt-4 text-xs text-critical">{error}</p> : null}

      <div className="mt-5 flex justify-start gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null}
          حفظ الفاتورة
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
