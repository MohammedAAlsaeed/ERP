import type { Messages } from "./en";

/* ---------------------------------------------------------------------------
   الترجمة العربية — Arabic catalogue.

   The `: Messages` annotation is the completeness check: a missing key or a
   stray one fails `tsc`, so this file cannot drift away from en.ts unnoticed.

   Arabic uses all six plural categories, so plural tables here are fuller than
   their English counterparts — `Intl.PluralRules("ar")` picks the right one and
   falls back to `other` for any category a table omits.
--------------------------------------------------------------------------- */

export const ar: Messages = {
  app: {
    name: "ERP",
    title: "نظام إدارة الموارد",
    description: "نظام مُوجز لإدارة العملاء والمخزون والفواتير والموظفين",
    brand: "نظام الموارد",
  },

  nav: {
    dashboard: "لوحة التحكم",
    customers: "العملاء",
    products: "المنتجات",
    invoices: "الفواتير",
    suppliers: "الموردون",
    employees: "الموظفون",
    reports: "التقارير",
    settings: "الإعدادات",
  },

  header: {
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    switchToLight: "التبديل إلى المظهر الفاتح",
    switchToDark: "التبديل إلى المظهر الداكن",
    userRole: "مدير النظام",
    userInitial: "م",
  },

  language: {
    label: "اللغة",
    change: "تغيير اللغة",
  },

  actions: {
    save: "حفظ",
    cancel: "إلغاء",
    close: "إغلاق",
    exportCsv: "تصدير CSV",
  },

  states: {
    loading: "جارٍ التحميل…",
    errorTitle: "تعذر تحميل البيانات",
    errorHint: "حاول تحديث الصفحة",
  },

  table: {
    search: "ابحث…",
    recordCount: {
      zero: "لا توجد سجلات",
      one: "سجل واحد",
      two: "سجلان",
      few: "{count} سجلات",
      many: "{count} سجلاً",
      other: "{count} سجل",
    },
    pageOf: "صفحة {page} من {pages}",
    previousPage: "الصفحة السابقة",
    nextPage: "الصفحة التالية",
    empty: "لا توجد سجلات",
  },

  validation: {
    required: "هذا الحقل مطلوب",
    phone: "رقم الهاتف غير صحيح",
    email: "البريد الإلكتروني غير صحيح",
    nonNegative: "لا يمكن أن يكون سالبًا",
    positive: "يجب أن يكون أكبر من صفر",
    integer: "يجب أن يكون رقمًا صحيحًا",
    minOneItem: "أضف بندًا واحدًا على الأقل",
    percentRange: "النسبة بين 0 و 100",
    taxNumber: "الرقم الضريبي غير صحيح",
  },

  errors: {
    request: "تعذر إكمال الطلب، حاول مرة أخرى",
    unknownCollection: "قسم غير معروف",
    notFound: "السجل غير موجود",
    invalidPayload: "البيانات المُرسلة غير صحيحة",
  },

  dashboard: {
    kpi: {
      revenue: "إيرادات الشهر حتى اليوم",
      invoices: "فواتير الشهر حتى اليوم",
      customers: "إجمالي العملاء",
      overdue: "مبالغ متأخرة",
    },
    vsPreviousMonth: "مقارنة بالشهر السابق",
    newCustomers: {
      zero: "لا عملاء جدد هذا الشهر",
      one: "عميل جديد واحد هذا الشهر",
      two: "عميلان جديدان هذا الشهر",
      few: "{count} عملاء جدد هذا الشهر",
      many: "{count} عميلاً جديدًا هذا الشهر",
      other: "{count} عميل جديد هذا الشهر",
    },
    overdueInvoices: {
      zero: "لا فواتير متأخرة",
      one: "فاتورة متأخرة واحدة",
      two: "فاتورتان متأخرتان",
      few: "{count} فواتير متأخرة",
      many: "{count} فاتورة متأخرة",
      other: "{count} فاتورة متأخرة",
    },
    revenueTitle: "الإيرادات والمصروفات",
    lastTwelveMonths: "آخر ١٢ شهرًا",
    series: {
      revenue: "الإيرادات",
      expenses: "المصروفات",
    },
    invoiceStatusTitle: "حالة الفواتير",
    invoiceStatusSubtitle: "التوزيع الحالي",
    invoiceStatusEmpty: "لا توجد فواتير بعد",
    invoiceCount: {
      zero: "لا فواتير",
      one: "فاتورة واحدة",
      two: "فاتورتان",
      few: "{count} فواتير",
      many: "{count} فاتورة",
      other: "{count} فاتورة",
    },
    categoryTitle: "المبيعات حسب التصنيف",
    categorySubtitle: "إجمالي قيمة المبيعات",
    categoryEmpty: "لا توجد مبيعات مسجلة بعد",
    lowStockTitle: "مخزون منخفض",
    lowStockSubtitle: "أصناف وصلت حد إعادة الطلب",
    lowStockEmpty: "كل الأصناف فوق حد إعادة الطلب",
    /* Spelled out rather than "5 / 20": a bare slash between two numbers flips
       order in an RTL paragraph. */
    lowStockLevel: "المتوفر {stock} من حد {reorder}",
  },

  customers: {
    title: "العملاء",
    subtitle: "بيانات العملاء وأرصدتهم الحالية",
    add: "إضافة عميل",
    empty: "لا يوجد عملاء مطابقون للبحث",
    search: "ابحث بالاسم أو المدينة…",
    deleteConfirm: "هل تريد حذف هذا السجل؟",
    deleteRecord: "حذف {name}",
    exportFilename: "قائمة_العملاء",
    columns: {
      name: "الاسم",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      city: "المدينة",
      balance: "الرصيد",
      createdAt: "تاريخ الإضافة",
    },
    form: {
      name: "اسم العميل",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      city: "المدينة",
      balance: "الرصيد الافتتاحي",
    },
  },

  suppliers: {
    title: "الموردون",
    subtitle: "جهات التوريد والمستحقات المسجلة",
    add: "إضافة مورد",
    empty: "لا يوجد موردون مطابقون للبحث",
    search: "ابحث بالاسم أو التصنيف…",
    deleteConfirm: "هل تريد حذف هذا السجل؟",
    deleteRecord: "حذف {name}",
    exportFilename: "قائمة_الموردين",
    columns: {
      name: "المورد",
      category: "التصنيف",
      phone: "الهاتف",
      city: "المدينة",
      balance: "المستحقات",
    },
    form: {
      name: "اسم المورد",
      category: "التصنيف",
      phone: "رقم الهاتف",
      city: "المدينة",
      balance: "المستحقات الحالية",
    },
  },

  products: {
    title: "المنتجات والمخزون",
    subtitle: "الأصناف والأسعار والكميات المتوفرة",
    add: "إضافة منتج",
    empty: "لا توجد منتجات مطابقة للبحث",
    search: "ابحث بالاسم أو الرمز…",
    deleteConfirm: "هل تريد حذف هذا السجل؟",
    deleteRecord: "حذف {name}",
    exportFilename: "قائمة_المنتجات",
    lowStockHint: "وصل حد إعادة الطلب",
    columns: {
      sku: "الرمز",
      name: "المنتج",
      category: "التصنيف",
      cost: "التكلفة",
      price: "سعر البيع",
      stock: "المخزون",
      reorderLevel: "حد إعادة الطلب",
    },
    form: {
      name: "اسم المنتج",
      sku: "رمز المنتج (SKU)",
      category: "التصنيف",
      cost: "سعر التكلفة",
      price: "سعر البيع",
      stock: "الكمية المتوفرة",
      reorderLevel: "حد إعادة الطلب",
    },
  },

  invoices: {
    title: "الفواتير",
    subtitle: "فواتير البيع وحالات التحصيل",
    add: "فاتورة جديدة",
    empty: "لا توجد فواتير مطابقة للبحث",
    search: "ابحث برقم الفاتورة أو العميل…",
    deleteConfirm: "هل تريد حذف هذه الفاتورة؟",
    deleteRecord: "حذف الفاتورة {number}",
    exportFilename: "قائمة_الفواتير",
    columns: {
      number: "رقم الفاتورة",
      customer: "العميل",
      date: "التاريخ",
      dueDate: "الاستحقاق",
      items: "البنود",
      total: "الإجمالي",
      status: "الحالة",
    },
    status: {
      paid: "مدفوعة",
      pending: "قيد الانتظار",
      overdue: "متأخرة",
      draft: "مسودة",
    },
    form: {
      customer: "العميل",
      customerPlaceholder: "اسم العميل",
      date: "تاريخ الفاتورة",
      dueDate: "تاريخ الاستحقاق",
      status: "الحالة",
      items: "بنود الفاتورة",
      description: "الوصف",
      lineDescription: "وصف البند {index}",
      lineQuantity: "كمية البند {index}",
      lineUnitPrice: "سعر البند {index}",
      removeLine: "حذف البند {index}",
      addLine: "إضافة بند",
      total: "الإجمالي",
      submit: "حفظ الفاتورة",
    },
  },

  employees: {
    title: "الموظفون",
    subtitle: "بيانات الكادر الوظيفي والرواتب",
    add: "إضافة موظف",
    empty: "لا يوجد موظفون مطابقون للبحث",
    search: "ابحث بالاسم أو الإدارة…",
    deleteConfirm: "هل تريد حذف هذا السجل؟",
    deleteRecord: "حذف {name}",
    exportFilename: "قائمة_الموظفين",
    columns: {
      name: "الاسم",
      position: "المسمى الوظيفي",
      department: "الإدارة",
      salary: "الراتب",
      hireDate: "تاريخ التعيين",
      status: "الحالة",
    },
    status: {
      active: "على رأس العمل",
      onLeave: "في إجازة",
      inactive: "منتهي",
    },
    form: {
      name: "اسم الموظف",
      position: "المسمى الوظيفي",
      department: "الإدارة",
      salary: "الراتب الشهري",
      hireDate: "تاريخ التعيين",
      status: "الحالة",
    },
    stats: {
      headcount: "إجمالي الكادر",
      headcountValue: {
        zero: "لا يوجد موظفون",
        one: "موظف واحد",
        two: "موظفان",
        few: "{count} موظفين",
        many: "{count} موظفًا",
        other: "{count} موظف",
      },
      departments: {
        zero: "بدون إدارات",
        one: "في إدارة واحدة",
        two: "موزعون على إدارتين",
        few: "موزعون على {count} إدارات",
        many: "موزعون على {count} إدارة",
        other: "موزعون على {count} إدارة",
      },
      active: "على رأس العمل",
      onLeaveNote: {
        one: "موظف واحد في إجازة حاليًا",
        two: "موظفان في إجازة حاليًا",
        few: "{count} موظفين في إجازة حاليًا",
        many: "{count} موظفًا في إجازة حاليًا",
        other: "{count} موظف في إجازة حاليًا",
      },
      allActive: "جميع الموظفين على رأس العمل",
      payroll: "مسير الرواتب الشهري",
      payrollNote: "إجمالي رواتب الكادر النشط",
      averageSalary: "متوسط الراتب",
      averageSalaryNote: "متوسط الأجر الشهري للموظف",
    },
  },

  reports: {
    title: "التقارير",
    revenue: "إيرادات ١٢ شهرًا",
    revenueNote: "مجموع الفواتير غير المسودة",
    netProfit: "صافي الربح التقديري",
    netProfitNote: "الإيرادات ناقص المصروفات",
    averageInvoice: "متوسط قيمة الفاتورة",
    averageInvoiceNote: "على أساس كل الفواتير",
    monthlyTitle: "التفصيل الشهري",
    monthlySubtitle: "القيم الكاملة",
    columns: {
      month: "الشهر",
      revenue: "الإيرادات",
      expenses: "المصروفات",
      net: "الصافي",
    },
  },

  settings: {
    title: "إعدادات المنشأة",
    subtitle: "تُحفظ حاليًا في هذا المتصفح فقط",
    form: {
      companyName: "اسم المنشأة",
      taxNumber: "الرقم الضريبي",
      taxRate: "نسبة الضريبة %",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      address: "العنوان",
    },
    submit: "حفظ الإعدادات",
    saved: "تم الحفظ",
    defaults: {
      companyName: "شركة المثال للتجارة",
      address: "الرياض، حي العليا",
    },
  },
};
