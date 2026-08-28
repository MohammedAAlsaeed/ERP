import type { Mirror } from "../types";

/* ---------------------------------------------------------------------------
   English catalogue — the source language.

   Conventions:
   • Keys are namespaced by feature (`customers.*`), then by role within it
     (`columns.*` for table headers, `form.*` for field labels).
   • `{placeholder}` slots are filled by the second argument of `t`; numbers
     passed in are formatted for the active locale.
   • A value with `one`/`other` is a plural table selected by `Intl.PluralRules`
     from the `count` variable.
   • Reuse over duplication: a column header and its CSV header are the same
     key, so an edit lands in both places.
--------------------------------------------------------------------------- */

export const en = {
  app: {
    name: "ERP",
    title: "Resource Management System",
    description:
      "A compact system for managing customers, inventory, invoices and staff.",
    brand: "Resource System",
  },

  nav: {
    dashboard: "Dashboard",
    customers: "Customers",
    products: "Products",
    invoices: "Invoices",
    suppliers: "Suppliers",
    employees: "Employees",
    reports: "Reports",
    settings: "Settings",
  },

  header: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
    userRole: "System administrator",
    /* Single glyph shown in the avatar; per-language so the Arabic UI is not
       stuck with a Latin initial. */
    userInitial: "A",
  },

  language: {
    label: "Language",
    change: "Change language",
  },

  actions: {
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    exportCsv: "Export CSV",
  },

  states: {
    loading: "Loading…",
    errorTitle: "Could not load the data",
    errorHint: "Try refreshing the page.",
  },

  table: {
    search: "Search…",
    recordCount: { one: "{count} record", other: "{count} records" },
    pageOf: "Page {page} of {pages}",
    previousPage: "Previous page",
    nextPage: "Next page",
    empty: "No records",
  },

  /* Returned by the zod schemas, which are shared with the API — the schemas
     carry these keys and the form translates them on display. */
  validation: {
    required: "This field is required",
    phone: "Enter a valid phone number",
    email: "Enter a valid email address",
    nonNegative: "Cannot be negative",
    positive: "Must be greater than zero",
    integer: "Must be a whole number",
    minOneItem: "Add at least one line item",
    percentRange: "Must be between 0 and 100",
    taxNumber: "Enter a valid tax number",
  },

  /* Keyed by the `code` the route handlers return, so the wire format stays
     language-neutral. */
  errors: {
    request: "The request could not be completed. Please try again.",
    unknownCollection: "Unknown collection",
    notFound: "Record not found",
    invalidPayload: "The submitted data is not valid",
  },

  dashboard: {
    kpi: {
      revenue: "Revenue month to date",
      invoices: "Invoices month to date",
      customers: "Total customers",
      overdue: "Overdue amount",
    },
    vsPreviousMonth: "vs. previous month",
    newCustomers: {
      one: "{count} new customer this month",
      other: "{count} new customers this month",
    },
    overdueInvoices: {
      one: "{count} overdue invoice",
      other: "{count} overdue invoices",
    },
    revenueTitle: "Revenue and expenses",
    lastTwelveMonths: "Last 12 months",
    series: {
      revenue: "Revenue",
      expenses: "Expenses",
    },
    invoiceStatusTitle: "Invoice status",
    invoiceStatusSubtitle: "Current distribution",
    invoiceStatusEmpty: "No invoices yet",
    invoiceCount: { one: "{count} invoice", other: "{count} invoices" },
    categoryTitle: "Sales by category",
    categorySubtitle: "Total sales value",
    categoryEmpty: "No sales recorded yet",
    lowStockTitle: "Low stock",
    lowStockSubtitle: "Items at or below the reorder level",
    lowStockEmpty: "Every item is above its reorder level",
    lowStockLevel: "{stock} in stock of a {reorder} threshold",
  },

  customers: {
    title: "Customers",
    subtitle: "Customer records and current balances",
    add: "Add customer",
    empty: "No customers match your search",
    search: "Search by name or city…",
    deleteConfirm: "Delete this record?",
    deleteRecord: "Delete {name}",
    exportFilename: "customers",
    columns: {
      name: "Name",
      phone: "Phone",
      email: "Email",
      city: "City",
      balance: "Balance",
      createdAt: "Added on",
    },
    form: {
      name: "Customer name",
      phone: "Phone number",
      email: "Email address",
      city: "City",
      balance: "Opening balance",
    },
  },

  suppliers: {
    title: "Suppliers",
    subtitle: "Supply partners and recorded payables",
    add: "Add supplier",
    empty: "No suppliers match your search",
    search: "Search by name or category…",
    deleteConfirm: "Delete this record?",
    deleteRecord: "Delete {name}",
    exportFilename: "suppliers",
    columns: {
      name: "Supplier",
      category: "Category",
      phone: "Phone",
      city: "City",
      balance: "Payable",
    },
    form: {
      name: "Supplier name",
      category: "Category",
      phone: "Phone number",
      city: "City",
      balance: "Current payable",
    },
  },

  products: {
    title: "Products and inventory",
    subtitle: "Items, prices and quantities on hand",
    add: "Add product",
    empty: "No products match your search",
    search: "Search by name or SKU…",
    deleteConfirm: "Delete this record?",
    deleteRecord: "Delete {name}",
    exportFilename: "products",
    lowStockHint: "At or below the reorder level",
    columns: {
      sku: "SKU",
      name: "Product",
      category: "Category",
      cost: "Cost",
      price: "Selling price",
      stock: "In stock",
      reorderLevel: "Reorder level",
    },
    form: {
      name: "Product name",
      sku: "Product code (SKU)",
      category: "Category",
      cost: "Cost price",
      price: "Selling price",
      stock: "Quantity on hand",
      reorderLevel: "Reorder level",
    },
  },

  invoices: {
    title: "Invoices",
    subtitle: "Sales invoices and collection status",
    add: "New invoice",
    empty: "No invoices match your search",
    search: "Search by invoice number or customer…",
    deleteConfirm: "Delete this invoice?",
    deleteRecord: "Delete invoice {number}",
    exportFilename: "invoices",
    columns: {
      number: "Invoice no.",
      customer: "Customer",
      date: "Date",
      dueDate: "Due",
      items: "Lines",
      total: "Total",
      status: "Status",
    },
    status: {
      paid: "Paid",
      pending: "Pending",
      overdue: "Overdue",
      draft: "Draft",
    },
    form: {
      customer: "Customer",
      customerPlaceholder: "Customer name",
      date: "Invoice date",
      dueDate: "Due date",
      status: "Status",
      items: "Invoice lines",
      description: "Description",
      lineDescription: "Line {index} description",
      lineQuantity: "Line {index} quantity",
      lineUnitPrice: "Line {index} unit price",
      removeLine: "Remove line {index}",
      addLine: "Add line",
      total: "Total",
      submit: "Save invoice",
    },
  },

  employees: {
    title: "Employees",
    subtitle: "Staff records and payroll",
    add: "Add employee",
    empty: "No employees match your search",
    search: "Search by name or department…",
    deleteConfirm: "Delete this record?",
    deleteRecord: "Delete {name}",
    exportFilename: "employees",
    columns: {
      name: "Name",
      position: "Position",
      department: "Department",
      salary: "Salary",
      hireDate: "Hire date",
      status: "Status",
    },
    status: {
      active: "Active",
      onLeave: "On leave",
      inactive: "Inactive",
    },
    form: {
      name: "Employee name",
      position: "Position",
      department: "Department",
      salary: "Monthly salary",
      hireDate: "Hire date",
      status: "Status",
    },
    stats: {
      headcount: "Total headcount",
      headcountValue: { one: "{count} employee", other: "{count} employees" },
      departments: {
        one: "Across {count} department",
        other: "Across {count} departments",
      },
      active: "Active staff",
      onLeaveNote: {
        one: "{count} employee currently on leave",
        other: "{count} employees currently on leave",
      },
      allActive: "Every employee is active",
      payroll: "Monthly payroll",
      payrollNote: "Total salaries of active staff",
      averageSalary: "Average salary",
      averageSalaryNote: "Average monthly pay per employee",
    },
  },

  reports: {
    title: "Reports",
    revenue: "Revenue, 12 months",
    revenueNote: "Total of all non-draft invoices",
    netProfit: "Estimated net profit",
    netProfitNote: "Revenue minus expenses",
    averageInvoice: "Average invoice value",
    averageInvoiceNote: "Across all invoices",
    monthlyTitle: "Monthly breakdown",
    monthlySubtitle: "Full values",
    columns: {
      month: "Month",
      revenue: "Revenue",
      expenses: "Expenses",
      net: "Net",
    },
  },

  settings: {
    title: "Organisation settings",
    subtitle: "Saved in this browser only for now",
    form: {
      companyName: "Organisation name",
      taxNumber: "Tax number",
      taxRate: "Tax rate %",
      email: "Email address",
      phone: "Phone number",
      address: "Address",
    },
    submit: "Save settings",
    saved: "Saved",
    /* Demo values for a form with no backend behind it yet. */
    defaults: {
      companyName: "Example Trading Co.",
      address: "Riyadh, Al Olaya district",
    },
  },
} as const;

/** The shape every other catalogue must implement — see ./ar.ts. */
export type Messages = Mirror<typeof en>;
