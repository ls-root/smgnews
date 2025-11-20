import { answers } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";

export async function getAnswer(answer: number) {
  return await db.select().from(answers).where(eq(answers.id, answer))
}
