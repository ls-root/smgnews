"use client"
import { useEffect } from "react"

export default function HashFix() {
  useEffect(() => {
    if (!location.hash) return

    const id = location.hash.slice(1)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView()
  }, [])

  return null
}
