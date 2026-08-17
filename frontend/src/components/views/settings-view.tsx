"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";

const settingsSchema = z.object({
  companyName: z.string().min(2, "هذا الحقل مطلوب"),
  taxNumber: z.string().min(5, "الرقم الضريبي غير صحيح"),
  taxRate: z.coerce.number().min(0).max(100, "النسبة بين 0 و 100"),
  address: z.string().min(3, "هذا الحقل مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(9, "رقم الهاتف غير صحيح"),
});

type Settings = z.infer<typeof settingsSchema>;

const defaults: Settings = {
  companyName: "شركة المثال للتجارة",
  taxNumber: "300000000000003",
  taxRate: 15,
  address: "الرياض، حي العليا",
  email: "info@example.com",
  phone: "0112345678",
};

const STORAGE_KEY = "erp-settings";

export function SettingsView() {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Settings>({
    resolver: zodResolver(settingsSchema) as Resolver<Settings>,
    defaultValues: defaults,
  });

  // Settings live in localStorage only — there is no backend behind them yet.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const parsed = settingsSchema.safeParse(JSON.parse(stored));
    if (parsed.success) reset(parsed.data);
  }, [reset]);

  const onSubmit = (values: Settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader
        title="إعدادات المنشأة"
        subtitle="تُحفظ حاليًا في هذا المتصفح فقط"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-5 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="اسم المنشأة" error={errors.companyName?.message}>
              <Input {...register("companyName")} />
            </Field>
          </div>

          <Field label="الرقم الضريبي" error={errors.taxNumber?.message}>
            <Input {...register("taxNumber")} />
          </Field>

          <Field label="نسبة الضريبة %" error={errors.taxRate?.message}>
            <Input type="number" step="any" {...register("taxRate")} />
          </Field>

          <Field label="البريد الإلكتروني" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </Field>

          <Field label="رقم الهاتف" error={errors.phone?.message}>
            <Input type="tel" {...register("phone")} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="العنوان" error={errors.address?.message}>
              <Input {...register("address")} />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit">حفظ الإعدادات</Button>
          {saved ? (
            <span className="flex items-center gap-1.5 text-xs text-good">
              <Check size={14} aria-hidden />
              تم الحفظ
            </span>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
