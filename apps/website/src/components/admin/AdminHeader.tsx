import Link from "next/link";
import { logout } from "@/app/(admin)/admin/actions";
import CarIcon from "@/components/branding/CarIcon";
import { LogOut } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CarIcon className="h-5 w-auto text-foreground/70" />
          <Link href="/" className="font-logo tracking-[0.2em] text-sm opacity-80 hover:opacity-100">SHIFTBOX</Link>
          <span className="opacity-50 text-xs">/ Admin</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/" className="px-3 py-1.5 rounded border bg-white/5 hover:bg-white/10">Public site</Link>
          <form action={logout}>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded border bg-white/5 hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
