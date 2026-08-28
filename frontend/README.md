# واجهة نظام ERP

واجهة عربية (RTL) بسيطة لنظام إدارة موارد، مبنية على Next.js 16 (App Router) و Tailwind CSS 4.

## التشغيل

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # بناء الإنتاج
npm run lint       # فحص ESLint
```

## الوحدات

| المسار | الوصف |
|--------|-------|
| `/` | لوحة تحكم: مؤشرات، إيرادات ومصروفات ١٢ شهرًا، حالة الفواتير، مخزون منخفض |
| `/customers` | العملاء — جدول + إضافة/حذف |
| `/products` | المنتجات والمخزون مع تمييز الأصناف تحت حد إعادة الطلب |
| `/invoices` | الفواتير مع بنود متعددة وحساب الإجمالي مباشرة |
| `/suppliers` | الموردون والمستحقات |
| `/employees` | الموظفون والرواتب |
| `/reports` | ملخص مالي + تفصيل شهري كجدول |
| `/settings` | إعدادات المنشأة (تُحفظ في `localStorage`) |

## المكتبات ومكان استخدامها

- **@tanstack/react-query** — كل جلب البيانات والإضافة والحذف (`src/lib/api.ts`, `src/components/resource-page.tsx`)
- **@tanstack/react-table v9** — جدول البيانات مع بحث وترتيب وتصفّح (`src/components/data-table.tsx`).
  الإصدار ٩ يستخدم `useTable` مع تسجيل الميزات عبر `tableFeatures` (وليس `useReactTable`).
- **react-hook-form + zod + @hookform/resolvers** — النماذج والتحقق (`src/components/entity-form.tsx`, `src/components/forms/invoice-form.tsx`).
  نفس مخططات zod في `src/lib/types.ts` تتحقق من الطلب في الواجهة وفي الـ API.
- **recharts** — الرسم الخطي للإيرادات والمصروفات (`src/components/charts/revenue-chart.tsx`)
- **date-fns** — التنسيق بالعربية (`src/lib/format.ts`)
- **lucide-react** — الأيقونات

## البيانات

لا يوجد ربط بالخادم بعد. الطلبات تذهب إلى معالجات المسارات في `src/app/api/` التي تقرأ من مخزن
في الذاكرة (`src/lib/db.ts`) مزروع ببيانات تجريبية ثابتة، ويُعاد ضبطه عند إعادة تشغيل الخادم.

للربط بـ Laravel في `../Backend`:

1. غيّر `BASE` في `src/lib/api.ts` إلى عنوان الـ API.
2. احذف `src/app/api/` و `src/lib/db.ts`.
3. أبقِ مخططات zod في `src/lib/types.ts` كعقد مشترك بين الطرفين.

## ملاحظات تقنية

- **الألوان**: التوكنات في `src/app/globals.css` والنسخة التي تستهلكها الرسوم في `src/lib/viz.ts`.
  ألوان السلاسل والتدرّج مُتحقَّق منها لعمى الألوان وللتباين في المظهرين، لذا عدّل الملفين معًا.
- **المظهر الداكن**: يتبع إعداد النظام، ويمكن تجاوزه من زر التبديل الذي يكتب `data-theme`
  على `<html>` مع سكربت في `layout.tsx` يمنع وميض المظهر قبل التحميل.
- **RTL**: `dir="rtl"` على مستوى الجذر، والرسم الخطي يقرأ من اليمين إلى اليسار (`reversed`).
