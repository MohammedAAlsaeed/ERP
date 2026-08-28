"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-ink-3 hover:bg-critical/10 hover:text-critical"
    >
      <Trash2 size={15} />
    </button>
  );
}
