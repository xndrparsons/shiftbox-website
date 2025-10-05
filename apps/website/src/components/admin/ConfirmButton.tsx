"use client";
import { useTransition } from "react";

type Props = {
  action: () => Promise<void>;
  confirmText?: string;
  className?: string;
  children: React.ReactNode;
};

export default function ConfirmButton({ action, confirmText = "Are you sure?", className = "", children }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        if (confirm(confirmText)) {
          startTransition(async () => {
            await action();
          });
        }
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
