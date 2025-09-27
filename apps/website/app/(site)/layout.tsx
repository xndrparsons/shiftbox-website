import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shiftbox",
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
