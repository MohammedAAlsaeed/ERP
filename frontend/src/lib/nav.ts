import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";

/** Single source of truth for the sidebar and the page titles. */
export const navigation = [
  { href: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/customers", label: "العملاء", icon: Users },
  { href: "/products", label: "المنتجات", icon: Package },
  { href: "/invoices", label: "الفواتير", icon: FileText },
  { href: "/suppliers", label: "الموردون", icon: Building2 },
  { href: "/employees", label: "الموظفون", icon: BriefcaseBusiness },
  { href: "/reports", label: "التقارير", icon: BarChart3 },
  { href: "/settings", label: "الإعدادات", icon: Settings },
] as const;
