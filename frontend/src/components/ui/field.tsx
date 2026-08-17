import { cn } from "@/lib/utils";

const control =
  "w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink " +
  "placeholder:text-ink-3 focus:border-brand focus:outline-none";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-2">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-critical">{error}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input {...props} className={cn(control, className)} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select {...props} className={cn(control, "appearance-none", className)} />;
}
