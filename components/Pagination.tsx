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
    <>
      <ArrowLeft
        onClick={handlePrevious}
        style={{
          cursor: "pointer",
          display: hasPreviousPage ? "block" : "none"
        }}
      />
      <p>{currentPage}/{totalPages}</p>
      <ArrowRight
        onClick={handleNext}
        style={{
          cursor: "pointer",
          display: hasNextPage ? "block" : "none"
        }}
      />
    </>
  )
}
