import { NextResponse } from "next/server";

import { remove, store } from "@/lib/db";

const collections = ["customers", "suppliers", "products", "employees", "invoices"] as const;

type Collection = (typeof collections)[number];

const isCollection = (value: string): value is Collection =>
  (collections as readonly string[]).includes(value);

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await params;

  if (!isCollection(collection)) {
    return NextResponse.json({ message: "قسم غير معروف" }, { status: 404 });
  }

  if (!remove(collection, id)) {
    return NextResponse.json({ message: "السجل غير موجود" }, { status: 404 });
  }

  return NextResponse.json({ id, remaining: store[collection].length });
}
