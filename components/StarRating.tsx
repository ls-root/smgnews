import { getStars } from "@/lib/drizzle/getStars"
import ClientStars from "./ClientStars"
import { cookies } from "next/headers"

export default async function StarRating({ postId }: { postId: number }) {
  const dbStars = await getStars(postId)
  const stars = (dbStars ?? []).map(s => s.stars)
  let totalStars = 0
  for (let i = 0; i < stars.length; i++) {
    totalStars += stars[i]!
  }
  const averageStars = stars.length > 0 ? totalStars / stars.length : 0

  const anonId = (await cookies()).get("anon_id")?.value ?? undefined

  const starsByUser = await getStars(postId, anonId)

  return (
    <div className="glass rounded-3xl p-2 w-1/2">
      <h4>Wie hat dir dieser Beitrag gefallen?</h4>
      <ClientStars postId={postId} average={averageStars} stars={stars.length} anonId={anonId} starsByUser={starsByUser} />
    </div>
  )
}
