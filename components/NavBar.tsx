"use client"
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";
import { cn } from "@/lib/cn";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className={cn(
      "fixed top-5 left-1/2 -translate-x-1/2 z-50",
      "flex flex-col glass transition-all duration-700 overflow-hidden",
      isOpen ? "rounded-4xl p-4 w-[90%] max-w-sm" : "rounded-4xl p-2 w-max"
    )}>
      <div className="flex items-center justify-between w-full px-2">
        <Link href="/" className="font-bold text-2xl text-blue-950 whitespace-nowrap">
          SMGNews
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1 text-blue-950 hover:bg-black/5 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>

        <div className="hidden md:flex items-center space-x-2 ml-4">
          <Button href="/team">Über uns</Button>
          <Button href="/kategorie">Kategorien</Button>
        </div>
      </div>

      <div className={cn(
        "md:hidden flex items-center justify-center gap-2 transition-all duration-700",
        isOpen ? "max-h-20 opacity-100 mt-4 pt-4 border-t border-blue-950/10" : "max-h-0 opacity-0"
      )}>
        <Button href="/team">Über uns</Button>
        <Button href="/kategorie">Kategorien</Button>
      </div>
    </nav>
  )
}
