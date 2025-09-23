import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        {children}
      </main>
      <Footer />
    </>
  )
}
