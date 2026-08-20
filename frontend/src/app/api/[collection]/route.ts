import { NextResponse } from "next/server";
import type { z } from "zod";

import { insert, store } from "@/lib/db";
import {
  customerSchema,
  employeeSchema,
  invoiceSchema,
  productSchema,
  supplierSchema,
} from "@/lib/types";

/* One handler for every collection: the segment name selects both the store
   bucket and the zod schema that validates the payload. */
const schemas = {
  customers: customerSchema,
  suppliers: supplierSchema,
  products: productSchema,
  employees: employeeSchema,
  invoices: invoiceSchema,
} satisfies Record<string, z.ZodType>;

type Collection = keyof typeof schemas;

const isCollection = (value: string): value is Collection => value in schemas;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ message: "قسم غير معروف" }, { status: 404 });
  }

  return NextResponse.json(store[collection]);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ message: "قسم غير معروف" }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = schemas[collection].safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "البيانات المُرسلة غير صحيحة",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  if (collection === "invoices") {
    const invoice = parsed.data as z.infer<typeof invoiceSchema>;
    const total = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const sequence = String(store.invoices.length + 1).padStart(3, "0");

    return NextResponse.json(
      insert("invoices", {
        ...invoice,
        total,
        number: `INV-${invoice.date.slice(0, 7).replace("-", "")}-${sequence}`,
      }),
      { status: 201 },
    );
  }

  return NextResponse.json(insert(collection, parsed.data as never), { status: 201 });
}
