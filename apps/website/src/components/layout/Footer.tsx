// server component
export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 text-sm">
        © {new Date().getFullYear()} Shiftbox
      </div>
    </footer>
  )
}
