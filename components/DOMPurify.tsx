"use client"

import wpRender from "@/utils/wpRender"
import createDOMPurify from "dompurify"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function DOMPurify({ html, renderWP, page = 0 }: { html: string, renderWP?: boolean, page?: number, }) {
  const [sanitized, setSanitized] = useState("")
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (!html) {
      setSanitized("")
      setTotalPages(0)
      return
    }

    if (!renderWP) {
      const DOMPurify = createDOMPurify(window)
      setSanitized(DOMPurify.sanitize(html))
      setTotalPages(1)
      return
    }

    const currentPage = Number(page)
    const pages = html.split("<!--nextpage-->")
    setTotalPages(pages.length)

    if (Number.isNaN(currentPage) || currentPage < 0 || currentPage >= pages.length) {
      setSanitized("<p>Diese Seite existiert nicht</p>")
      return
    }

    setSanitized(wpRender(pages[currentPage]))
  }, [html, renderWP, page])

  if (!sanitized) return <p>Fehler beim sicheren anzeigen des Textes</p>

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: sanitized }} />

      {renderWP && totalPages > 1 && (
        <nav className="flex space-x-1 mb-4">
          {page > 0 && (
            <a href={`?page=${page - 1}`} className="post-pagination-prev">
              <ArrowLeft
                className="glass size-12 rounded-full p-2"
              />
            </a>
          )}
          <p className="glass content-center rounded-full px-4 text-lg">Seite <b>{page + 1}</b> von <b>{totalPages}</b></p>
          {page < totalPages - 1 && (
            <a href={`?page=${page + 1}`} className="post-pagination-next">
              <ArrowRight
                className="glass size-12 rounded-full p-2"
              />
            </a>
          )}
        </nav>
      )}
    </>
  )
}
