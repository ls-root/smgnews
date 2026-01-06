"use client"
import { PaginationInfo } from "@/types/PaginationInfo"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

export default function Pagination({ hasNextPage, hasPreviousPage, currentPage, totalPages }: PaginationInfo) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleNext = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", (currentPage + 1).toString())
    router.push(`?${params.toString()}`, { scroll: true })
  }

  const handlePrevious = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", (currentPage - 1).toString())
    router.push(`?${params.toString()}`, { scroll: true })
  }

  return (
    <div className="flex space-x-1 mt-4">
      <ArrowLeft
        className="glass size-12 rounded-full p-2"
        onClick={handlePrevious}
        style={{
          cursor: "pointer",
          display: hasPreviousPage ? "block" : "none"
        }}
      />
      <p className="glass content-center rounded-full px-4 text-lg">Seite <b>{currentPage}</b> von <b>{totalPages}</b></p>
      <ArrowRight
        className="glass size-12 rounded-full p-2"
        onClick={handleNext}
        style={{
          cursor: "pointer",
          display: hasNextPage ? "block" : "none"
        }}
      />
    </div>
  )
}
