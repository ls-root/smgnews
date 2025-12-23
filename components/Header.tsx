"use client"
import { useHeader } from "@/contexts/HeaderContext";
import { cn } from "@/lib/cn";
import Image from "next/image";

export default function Header() {
  const { header } = useHeader()

  return (
    <div className="relative w-full h-120 sm:h-80 md:h-96 overflow-hidden my-8 rounded-3xl border-blue-300/50 border-2">
      <Image
        src={header.image || "/header.jpg"}
        alt={header.title || ""}
        fill
        className="object-cover"
        priority
      />

      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center p-8 text-blue-950",
        header.image !== undefined && header.image !== "/header.jpg" && "text-white mix-blend-difference")
      }>
        <section className="text-3xl sm:text-5xl font-bold mb-2">{header.title || "SMGNews"}</section> {/*Use section or any other component to not get overriden styles from globals.css*/}
        <p>{header.subtitle || "Die digital Schülerzeitung des Städt. Meerbusch Gymnasium"}</p>

        {header.subcontent && <div className="z-10 relative">{header.subcontent}</div>}
      </div>

    </div>
  )
}
