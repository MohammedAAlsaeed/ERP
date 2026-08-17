import type {
  Customer,
  Employee,
  Invoice,
  Product,
  Stats,
  Supplier,
} from "./types";

/* Thin client for the demo route handlers under src/app/api. Point BASE at the
   Laravel API to move off the in-memory store. */
const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "تعذر إكمال الطلب، حاول مرة أخرى");
  }

  return response.json() as Promise<T>;
}

export type Collection = "customers" | "suppliers" | "products" | "employees" | "invoices";

type Records = {
  customers: Customer;
  suppliers: Supplier;
  products: Product;
  employees: Employee;
  invoices: Invoice;
};

export const queryKeys = {
  list: (collection: Collection) => [collection] as const,
  stats: ["stats"] as const,
};

export const listRecords = <K extends Collection>(collection: K) =>
  request<Records[K][]>(`/${collection}`);

export const createRecord = <K extends Collection>(collection: K, values: unknown) =>
  request<Records[K]>(`/${collection}`, {
    method: "POST",
    body: JSON.stringify(values),
  });

export const deleteRecord = (collection: Collection, id: string) =>
  request<{ id: string }>(`/${collection}/${id}`, { method: "DELETE" });

export const fetchStats = () => request<Stats>("/stats");
