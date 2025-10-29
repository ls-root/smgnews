"use client"

import createDOMPurify from "dompurify"
import { useEffect, useState } from "react"

export default function PostExcerpt({ excerpt }: { excerpt: string }) {
  const [sanitized, setSanitized] = useState("")

  useEffect(() => {
    const DOMPurify = createDOMPurify(window)
    setSanitized(DOMPurify.sanitize(excerpt))
  }, [excerpt])

  if (!sanitized) return <p>Fehler beim sicheren anzeigen der Beschreibung</p>

  return <p dangerouslySetInnerHTML={{ __html: sanitized }} />
}
