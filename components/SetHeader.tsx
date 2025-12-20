"use client"

import { useHeader } from "@/contexts/HeaderContext"
import { useEffect } from "react"

export default function SetHeader({ image, title, subtitle, subcontent }: { image?: string, title?: string, subtitle?: string, subcontent?: React.ReactNode }) {
  const { setHeader } = useHeader()

  useEffect(() => {
    setHeader({ image, title, subtitle, subcontent })
  }, [image, title, subtitle, subcontent, setHeader])

  return null
}
