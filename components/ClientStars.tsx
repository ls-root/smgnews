"use client"

import { voteStarAction } from "@/lib/actions"
import { Star } from "@/types/Star"
import { Star as StarIcon } from "lucide-react"
import { useTransition } from "react"

export default function ClientStars({
  postId, stars, average, anonId, starsByUser
}: {
  postId: number, stars: number, average: number, anonId: string | undefined, starsByUser: Star[]
}) {
  const [isPending, startTransition] = useTransition()

  const onStarClick = (stars: number) => {
    startTransition(async () => {
      await voteStarAction(postId, stars, anonId)
    })
  }

  const starsRated = starsByUser[0]?.stars ?? 0

  return (
    <>
      <div className="flex">
        {Array.from(Array(5).keys()).map(star => (
          <StarIcon
            fill={starsRated <= star ? "#7285b8" : "#4a66b5"}
            color={starsRated <= star ? "#506ab2" : "#2b4ead"}
            size={50}
            key={star}
            onClick={() => onStarClick(star + 1)}
            className="duration-700 hover:rotate-45 cursor-pointer"
            style={{ opacity: isPending ? 0.7 : 1 }}
          />
        ))}
      </div>
      <p>Dieser Beitrag wurde von <b>{stars}</b> Person{stars == 1 ? "" : "en"} durchschnittlich mit <b>{average.toFixed(1)} Sternen bewertet</b></p>
    </>
  )
}
