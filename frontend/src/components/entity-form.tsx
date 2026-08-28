"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
} from "react-hook-form";
import type { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";

export type FormField<TValues extends FieldValues> = {
  name: Path<TValues>;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date";
  options?: { value: string; label: string }[];
  wide?: boolean;
};

type EntityFormProps<TValues extends FieldValues> = {
  /**
   * The same schema the API validates against, so both sides agree. The input
   * type stays loose because `z.coerce.number()` accepts the string an <input>
   * produces while the parsed output is a number.
   */
  schema: ZodType<TValues, FieldValues>;
  fields: FormField<TValues>[];
  defaultValues: DefaultValues<TValues>;
  submitLabel: string;
  pending: boolean;
  error?: string;
  onSubmit: (values: TValues) => void;
  onCancel: () => void;
};

export function EntityForm<TValues extends FieldValues>({
  schema,
  fields,
  defaultValues,
  submitLabel,
  pending,
  error,
  onSubmit,
  onCancel,
}: EntityFormProps<TValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TValues>({
    // zodResolver hands back the parsed output, so `z.coerce.number()` fields
    // arrive as numbers even though the input element yields a string.
    resolver: zodResolver(schema) as Resolver<TValues>,
    defaultValues,
  });

  const messageFor = (name: string) =>
    (errors as Record<string, { message?: string } | undefined>)[name]?.message;

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.wide ? "sm:col-span-2" : undefined}>
            <Field label={field.label} error={messageFor(field.name)}>
              {field.options ? (
                <Select {...register(field.name)}>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  type={field.type ?? "text"}
                  step={field.type === "number" ? "any" : undefined}
                  {...register(field.name)}
                />
              )}
            </Field>
          </div>
        ))}
      </div>

      {error ? <p className="mt-4 text-xs text-critical">{error}</p> : null}

      <div className="mt-6 flex justify-start gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null}
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
