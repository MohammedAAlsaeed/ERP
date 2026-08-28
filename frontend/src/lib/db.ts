import { format, subDays, subMonths } from "date-fns";

import type {
  Customer,
  Employee,
  Invoice,
  InvoiceStatus,
  Product,
  Stats,
  Supplier,
} from "./types";

/* ---------------------------------------------------------------------------
   In-memory demo store. It replaces a real backend so the UI can be explored
   end to end; swap the exported functions for HTTP calls to the Laravel API in
   ../Backend when it is ready. State is kept on `globalThis` so it survives the
   dev server's hot reloads, and it resets whenever the process restarts.
--------------------------------------------------------------------------- */

/** Deterministic pseudo-random so the demo data looks the same on every boot. */
function makeRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
}

const pick = <T>(items: readonly T[], rand: () => number) =>
  items[Math.floor(rand() * items.length)];

const iso = (date: Date) => format(date, "yyyy-MM-dd");

const FIRST_NAMES = [
  "محمد", "أحمد", "عبدالله", "سارة", "فاطمة", "خالد", "نورة", "يوسف",
  "عمر", "ليلى", "سلمان", "هند", "طارق", "ريم", "بدر", "منى",
] as const;

const LAST_NAMES = [
  "العتيبي", "الحربي", "القحطاني", "الزهراني", "الشمري", "الدوسري",
  "السعيد", "الغامدي", "المطيري", "البلوي",
] as const;

const CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "أبها", "تبوك"] as const;

const CATEGORIES = ["إلكترونيات", "أثاث مكتبي", "قرطاسية", "أجهزة شبكات", "مستلزمات تشغيل"] as const;

const PRODUCT_NAMES = [
  "حاسب محمول", "شاشة عرض 27 بوصة", "لوحة مفاتيح لاسلكية", "فأرة بصرية",
  "كرسي مكتب مريح", "طاولة اجتماعات", "خزانة ملفات", "طابعة ليزر",
  "حزمة ورق A4", "مجموعة أقلام", "دفتر ملاحظات", "حبر طابعة",
  "موجه شبكة", "مبدّل شبكة 24 منفذًا", "كابل شبكة 5 أمتار", "نقطة وصول لاسلكية",
  "قرص تخزين خارجي", "مكيف مكتبي", "سماعة رأس للاجتماعات", "كاميرا ويب",
  "مصباح مكتب", "لوح كتابة", "آلة تقطيع ورق", "مبرد مياه",
] as const;

const DEPARTMENTS = ["المالية", "المبيعات", "المستودع", "الموارد البشرية", "تقنية المعلومات"] as const;

const POSITIONS = [
  "محاسب", "مدير مبيعات", "أمين مستودع", "أخصائي موارد بشرية",
  "مهندس دعم فني", "مسؤول مشتريات", "مندوب مبيعات",
] as const;

const SUPPLIER_NAMES = [
  "شركة الأفق للتوريدات", "مؤسسة النخبة التجارية", "مجموعة الرياض للتقنية",
  "شركة البحر الأحمر للأثاث", "مؤسسة الوفاء للقرطاسية", "شركة الخليج للشبكات",
  "مصنع الجودة للأثاث المكتبي", "شركة التقنية المتقدمة", "مؤسسة الإمداد السريع",
  "شركة المستقبل للحلول", "مجموعة الشرق للتجارة", "مؤسسة الرواد للتوريد",
] as const;

function seedCustomers(): Customer[] {
  const rand = makeRandom(11);
  return Array.from({ length: 34 }, (_, index) => {
    const name = `${pick(FIRST_NAMES, rand)} ${pick(LAST_NAMES, rand)}`;
    return {
      id: `cus-${index + 1}`,
      name,
      phone: `05${Math.floor(rand() * 90000000 + 10000000)}`,
      email: `customer${index + 1}@example.com`,
      city: pick(CITIES, rand),
      balance: Math.round(rand() * 48000),
      createdAt: iso(subDays(new Date(), Math.floor(rand() * 540))),
    };
  });
}

function seedSuppliers(): Supplier[] {
  const rand = makeRandom(23);
  return SUPPLIER_NAMES.map((name, index) => ({
    id: `sup-${index + 1}`,
    name,
    phone: `01${Math.floor(rand() * 9000000 + 1000000)}`,
    category: pick(CATEGORIES, rand),
    city: pick(CITIES, rand),
    balance: Math.round(rand() * 120000),
    createdAt: iso(subDays(new Date(), Math.floor(rand() * 720))),
  }));
}

function seedProducts(): Product[] {
  const rand = makeRandom(37);
  return PRODUCT_NAMES.map((name, index) => {
    const cost = Math.round((rand() * 2400 + 40) / 5) * 5;
    const stock = Math.floor(rand() * 160);
    return {
      id: `prd-${index + 1}`,
      sku: `SKU-${String(index + 1).padStart(4, "0")}`,
      name,
      category: pick(CATEGORIES, rand),
      cost,
      price: Math.round((cost * (1.25 + rand() * 0.4)) / 5) * 5,
      stock,
      reorderLevel: 20,
      createdAt: iso(subDays(new Date(), Math.floor(rand() * 400))),
    };
  });
}

function seedEmployees(): Employee[] {
  const rand = makeRandom(53);
  return Array.from({ length: 14 }, (_, index) => ({
    id: `emp-${index + 1}`,
    name: `${pick(FIRST_NAMES, rand)} ${pick(LAST_NAMES, rand)}`,
    position: pick(POSITIONS, rand),
    department: pick(DEPARTMENTS, rand),
    salary: Math.round((rand() * 14000 + 5000) / 100) * 100,
    hireDate: iso(subDays(new Date(), Math.floor(rand() * 1800 + 90))),
    status: rand() > 0.85 ? "onLeave" : rand() > 0.95 ? "inactive" : "active",
    createdAt: iso(subDays(new Date(), Math.floor(rand() * 1800 + 90))),
  }));
}

function seedInvoices(customers: Customer[], products: Product[]): Invoice[] {
  const rand = makeRandom(71);
  const statuses: InvoiceStatus[] = ["paid", "paid", "paid", "pending", "overdue", "draft"];

  return Array.from({ length: 58 }, (_, index) => {
    const date = subDays(new Date(), Math.floor(rand() * 330));
    const items = Array.from({ length: Math.floor(rand() * 3) + 1 }, () => {
      const product = pick(products, rand);
      return {
        description: product.name,
        quantity: Math.floor(rand() * 6) + 1,
        unitPrice: product.price,
      };
    });

    return {
      id: `inv-${index + 1}`,
      number: `INV-${format(date, "yyyyMM")}-${String(index + 1).padStart(3, "0")}`,
      customerName: pick(customers, rand).name,
      date: iso(date),
      dueDate: iso(subDays(date, -30)),
      status: pick(statuses, rand),
      items,
      total: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      createdAt: iso(date),
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

type Store = {
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  employees: Employee[];
  invoices: Invoice[];
};

function createStore(): Store {
  const customers = seedCustomers();
  const products = seedProducts();
  return {
    customers,
    products,
    suppliers: seedSuppliers(),
    employees: seedEmployees(),
    invoices: seedInvoices(customers, products),
  };
}

const globalStore = globalThis as typeof globalThis & { __erpStore?: Store };
export const store: Store = (globalStore.__erpStore ??= createStore());

/** Prepends a record with a generated id, newest first. */
export function insert<K extends keyof Store>(
  collection: K,
  values: Omit<Store[K][number], "id" | "createdAt">,
): Store[K][number] {
  const prefix = collection.slice(0, 3);
  const record = {
    ...values,
    id: `${prefix}-${Date.now()}`,
    createdAt: iso(new Date()),
  } as Store[K][number];

  store[collection].unshift(record as never);
  return record;
}

export function remove<K extends keyof Store>(collection: K, id: string): boolean {
  const index = store[collection].findIndex((record) => record.id === id);
  if (index === -1) return false;
  store[collection].splice(index, 1);
  return true;
}

export function buildStats(): Stats {
  const { invoices, customers, products } = store;
  const paidOrPending = invoices.filter((invoice) => invoice.status !== "draft");

  const monthly = Array.from({ length: 12 }, (_, offset) => {
    const monthDate = subMonths(new Date(), 11 - offset);
    const key = format(monthDate, "yyyy-MM");
    const revenue = paidOrPending
      .filter((invoice) => invoice.date.startsWith(key))
      .reduce((sum, invoice) => sum + invoice.total, 0);

    return {
      month: format(monthDate, "yyyy-MM"),
      revenue,
      // Expenses are modelled as cost of sales plus a flat operating base.
      expenses: Math.round(revenue * 0.62) + 18000,
    };
  });

  const currentMonth = monthly[monthly.length - 1];
  const previousMonth = monthly[monthly.length - 2];
  const change = (now: number, before: number) =>
    before === 0 ? 0 : Math.round(((now - before) / before) * 100);

  const currentKey = currentMonth.month;
  const previousKey = previousMonth.month;
  const ordersNow = paidOrPending.filter((i) => i.date.startsWith(currentKey)).length;
  const ordersBefore = paidOrPending.filter((i) => i.date.startsWith(previousKey)).length;
  const overdue = invoices.filter((invoice) => invoice.status === "overdue");

  const categoryTotals = new Map<string, number>();
  for (const invoice of paidOrPending) {
    for (const item of invoice.items) {
      const category =
        products.find((product) => product.name === item.description)?.category ?? "أخرى";
      categoryTotals.set(
        category,
        (categoryTotals.get(category) ?? 0) + item.quantity * item.unitPrice,
      );
    }
  }

  const statuses: InvoiceStatus[] = ["paid", "pending", "overdue", "draft"];

  return {
    kpis: {
      revenue: currentMonth.revenue,
      revenueChange: change(currentMonth.revenue, previousMonth.revenue),
      orders: ordersNow,
      ordersChange: change(ordersNow, ordersBefore),
      customers: customers.length,
      newCustomers: customers.filter((c) => c.createdAt.startsWith(currentKey)).length,
      overdue: overdue.reduce((sum, invoice) => sum + invoice.total, 0),
      overdueCount: overdue.length,
    },
    monthly,
    categories: [...categoryTotals.entries()]
      .map(([category, sales]) => ({ category, sales }))
      .sort((a, b) => b.sales - a.sales),
    invoiceStatus: statuses.map((status) => {
      const matching = invoices.filter((invoice) => invoice.status === status);
      return {
        status,
        count: matching.length,
        total: matching.reduce((sum, invoice) => sum + invoice.total, 0),
      };
    }),
    lowStock: products
      .filter((product) => product.stock <= product.reorderLevel)
      .sort((a, b) => a.stock - b.stock)
      .map(({ name, stock, reorderLevel }) => ({ name, stock, reorderLevel })),
  };
}
