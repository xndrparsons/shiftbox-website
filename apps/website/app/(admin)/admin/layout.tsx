import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-heading">Admin</h1>
      {children}
    </main>
  );
}
