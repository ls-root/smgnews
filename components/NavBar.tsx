import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="
    fixed top-5 left-1/2 -translate-x-1/2 z-50 flex 
    items-center space-x-4 p-2
    border bg-white">
      <Link href="/" className="font-bold">SMGNews</Link>
      <Link href="/team">Über uns</Link>
      <Link href="/kategorie">Kategorien</Link>
    </nav>
  )
}
