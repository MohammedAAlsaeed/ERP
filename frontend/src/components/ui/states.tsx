import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

export function Loading({ label = "جارٍ التحميل…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-14 text-sm text-ink-3">
      <Loader2 size={16} className="animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
      <AlertTriangle size={20} className="text-critical" aria-hidden />
      <p className="text-sm font-medium text-ink">تعذر تحميل البيانات</p>
      <p className="text-xs text-ink-3">{message ?? "حاول تحديث الصفحة"}</p>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
      <Inbox size={20} className="text-ink-3" aria-hidden />
      <p className="text-sm text-ink-2">{label}</p>
    </div>
  );
}
