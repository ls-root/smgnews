"use server"
import { answers } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";

/**
 * up vote an answer on a poll
 * @param {number} answerId - id of the answer you want to vote for. You get the ID from getRandomPoll()
*/
export async function voteAnswer(answerId: number) {
  const answer = await db.select().from(answers).where(eq(answers.id, answerId))
  if (answer[0].id) {
    await db.update(answers)
      .set({ votes: (answer[0].votes || 0) + 1 })
      .where(eq(answers.id, answerId))
    return { succes: true, message: "Danke für deinen Beitrag" }
  } else {
    return { succes: false, message: "Diese Antwort exsistiert nicht." }
  }
}
