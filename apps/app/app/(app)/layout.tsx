export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r p-4">Shiftbox • App</aside>
      <main className="p-6">{children}</main>
    </div>
  )
}
