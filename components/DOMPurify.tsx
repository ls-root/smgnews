"use client"

import createDOMPurify from "dompurify"
import { useEffect, useState } from "react"

export default function DOMPurify({ html }: { html: string }) {
  const [sanitized, setSanitized] = useState("")

  useEffect(() => {
    const DOMPurify = createDOMPurify(window)
    setSanitized(DOMPurify.sanitize(html))
  }, [html])

  if (!sanitized) return <p>Fehler beim sicheren anzeigen des Textes</p>

  return <p dangerouslySetInnerHTML={{ __html: sanitized }} />
}
