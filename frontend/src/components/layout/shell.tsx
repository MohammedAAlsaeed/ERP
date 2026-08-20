"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { navigation } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useIsDark } from "@/lib/viz";

function useCurrentPage() {
  const pathname = usePathname();
  // Longest matching href wins so /invoices/new still highlights /invoices.
  return (
    [...navigation]
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0] ?? navigation[0]
  );
}

function ThemeToggle() {
  // Stamping <html> is the only state change needed — useIsDark reads it back.
  const isDark = useIsDark();

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("erp-theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "التبديل إلى المظهر الفاتح" : "التبديل إلى المظهر الداكن"}
      className="rounded-lg border border-line p-2 text-ink-2 hover:bg-page hover:text-ink"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  const current = useCurrentPage();

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = current.href === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-brand-soft font-medium text-brand"
                : "text-ink-2 hover:bg-page hover:text-ink",
            )}
          >
            <Icon size={17} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const current = useCurrentPage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-l border-line bg-card lg:block">
        <div className="flex h-14 items-center gap-2 border-b border-line px-5">
          <span className="grid size-7 place-items-center rounded-md bg-brand text-xs font-bold text-white">
            ERP
          </span>
          <span className="text-sm font-semibold text-ink">نظام الموارد</span>
        </div>
        <SidebarLinks />
      </aside>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 right-0 w-64 border-l border-line bg-card">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="text-sm font-semibold text-ink">نظام الموارد</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="إغلاق القائمة"
                className="rounded-md p-1 text-ink-3 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarLinks onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="فتح القائمة"
              className="rounded-lg border border-line p-2 text-ink-2 lg:hidden"
            >
              <Menu size={16} />
            </button>
            <h1 className="text-sm font-semibold text-ink">{current.label}</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-ink-3 sm:block">مدير النظام</span>
              <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                م
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
