"use server"
import { revalidatePath } from "next/cache";
import voteStars from "./drizzle/voteStars";

export async function voteStarAction(postId: number, stars: number, anonId: string | undefined) {
  if (anonId) {
    await voteStars(postId, stars, anonId)
  }
  revalidatePath(`/artikel/${postId}`)
}
