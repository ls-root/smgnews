"use client"
import { HeaderData } from "@/types/HeaderData";
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext<{
  header: HeaderData,
  setHeader: React.Dispatch<React.SetStateAction<HeaderData>>
} | null>(null)

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [header, setHeader] = useState<HeaderData>({})
  return (
    <HeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (!context) throw new Error("useHeader must be used within HeaderProvider")
  return context
}
