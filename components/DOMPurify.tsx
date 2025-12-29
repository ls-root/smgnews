"use client"

import wpRender from "@/utils/wpRender"
import createDOMPurify from "dompurify"
import { useEffect, useState } from "react"

export default function DOMPurify({ html, renderWP }: { html: string, renderWP?: boolean }) {
  const [sanitized, setSanitized] = useState("")

  useEffect(() => {
    if (!renderWP) {
      const DOMPurify = createDOMPurify(window)
      setSanitized(DOMPurify.sanitize(html))
    } else {
      setSanitized(wpRender(html))
    }
  }, [html])

  if (!sanitized) return <p>Fehler beim sicheren anzeigen des Textes</p>

  return <p dangerouslySetInnerHTML={{ __html: sanitized }} />
}
