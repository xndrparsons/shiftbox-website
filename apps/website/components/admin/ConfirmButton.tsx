"use client";

import { useTransition } from "react";

export default function ConfirmButton({
  action,
  children,
  confirmText = "Are you sure?",
  className = "",
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  confirmText?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() => {
        if (confirm(confirmText)) {
          startTransition(() => {
            action();
          });
        }
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
