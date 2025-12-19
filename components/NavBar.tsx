import Link from "next/link";
import Button from "./Button";

export default function NavBar() {
  return (
    <nav className="
    fixed top-5 left-1/2 -translate-x-1/2 z-50 flex 
    items-center space-x-4 p-2 glass
    ">
      <Link href="/" className="font-bold text-2xl text-blue-950">SMGNews</Link>
      <Button href="/team">Über uns</Button>
      <Button href="/kategorie">Kategorien</Button>
    </nav>
  )
}
