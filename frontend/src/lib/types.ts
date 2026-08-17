import { z } from "zod";

/* Every entity has a zod schema; the form types and the API validation are both
   derived from it so a field is only ever described once. */

const required = "هذا الحقل مطلوب";

export const customerSchema = z.object({
  name: z.string().min(2, required),
  phone: z.string().min(9, "رقم الهاتف غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح").or(z.literal("")),
  city: z.string().min(2, required),
  balance: z.coerce.number().min(0, "لا يمكن أن يكون سالبًا"),
});

export const supplierSchema = z.object({
  name: z.string().min(2, required),
  phone: z.string().min(9, "رقم الهاتف غير صحيح"),
  category: z.string().min(2, required),
  city: z.string().min(2, required),
  balance: z.coerce.number().min(0, "لا يمكن أن يكون سالبًا"),
});

export const productSchema = z.object({
  sku: z.string().min(2, required),
  name: z.string().min(2, required),
  category: z.string().min(2, required),
  price: z.coerce.number().positive("يجب أن يكون أكبر من صفر"),
  cost: z.coerce.number().min(0, "لا يمكن أن يكون سالبًا"),
  stock: z.coerce.number().int("يجب أن يكون رقمًا صحيحًا").min(0, "لا يمكن أن يكون سالبًا"),
  reorderLevel: z.coerce.number().int().min(0),
});

export const employeeSchema = z.object({
  name: z.string().min(2, required),
  position: z.string().min(2, required),
  department: z.string().min(2, required),
  salary: z.coerce.number().positive("يجب أن يكون أكبر من صفر"),
  hireDate: z.string().min(1, required),
  status: z.enum(["active", "onLeave", "inactive"]),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(2, required),
  quantity: z.coerce.number().int().positive("يجب أن تكون أكبر من صفر"),
  unitPrice: z.coerce.number().positive("يجب أن يكون أكبر من صفر"),
});

export const invoiceSchema = z.object({
  customerName: z.string().min(2, required),
  date: z.string().min(1, required),
  dueDate: z.string().min(1, required),
  status: z.enum(["paid", "pending", "overdue", "draft"]),
  items: z.array(invoiceItemSchema).min(1, "أضف بندًا واحدًا على الأقل"),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type SupplierInput = z.infer<typeof supplierSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;

export type Customer = CustomerInput & { id: string; createdAt: string };
export type Supplier = SupplierInput & { id: string; createdAt: string };
export type Product = ProductInput & { id: string; createdAt: string };
export type Employee = EmployeeInput & { id: string; createdAt: string };
export type Invoice = InvoiceInput & {
  id: string;
  number: string;
  total: number;
  createdAt: string;
};

export type InvoiceStatus = Invoice["status"];
export type EmployeeStatus = Employee["status"];

export type Stats = {
  kpis: {
    revenue: number;
    revenueChange: number;
    orders: number;
    ordersChange: number;
    customers: number;
    newCustomers: number;
    overdue: number;
    overdueCount: number;
  };
  monthly: { month: string; revenue: number; expenses: number }[];
  categories: { category: string; sales: number }[];
  invoiceStatus: { status: InvoiceStatus; count: number; total: number }[];
  lowStock: { name: string; stock: number; reorderLevel: number }[];
};

export const entityLabels = {
  customers: "العملاء",
  suppliers: "الموردون",
  products: "المنتجات",
  invoices: "الفواتير",
  employees: "الموظفون",
} as const;

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  paid: "مدفوعة",
  pending: "قيد الانتظار",
  overdue: "متأخرة",
  draft: "مسودة",
};

export const employeeStatusLabels: Record<EmployeeStatus, string> = {
  active: "على رأس العمل",
  onLeave: "في إجازة",
  inactive: "منتهي",
};
