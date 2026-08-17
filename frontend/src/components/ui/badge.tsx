import { AlertTriangle, CheckCircle2, Clock, FileEdit } from "lucide-react";

import {
  employeeStatusLabels,
  invoiceStatusLabels,
  type EmployeeStatus,
  type InvoiceStatus,
} from "@/lib/types";

/* Status is never carried by colour alone — every badge ships an icon and a
   label, which is also what keeps the sub-3:1 warning/serious hues legible. */
const invoiceStyles: Record<InvoiceStatus, { className: string; Icon: typeof CheckCircle2 }> = {
  paid: { className: "bg-good/10 text-good", Icon: CheckCircle2 },
  pending: { className: "bg-warning/15 text-ink-2", Icon: Clock },
  overdue: { className: "bg-critical/10 text-critical", Icon: AlertTriangle },
  draft: { className: "bg-serious/15 text-ink-2", Icon: FileEdit },
};

const employeeStyles: Record<EmployeeStatus, string> = {
  active: "bg-good/10 text-good",
  onLeave: "bg-warning/15 text-ink-2",
  inactive: "bg-line text-ink-2",
};

const base =
  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap";

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { className, Icon } = invoiceStyles[status];
  return (
    <span className={`${base} ${className}`}>
      <Icon size={13} aria-hidden />
      {invoiceStatusLabels[status]}
    </span>
  );
}

export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  return (
    <span className={`${base} ${employeeStyles[status]}`}>
      {employeeStatusLabels[status]}
    </span>
  );
}
