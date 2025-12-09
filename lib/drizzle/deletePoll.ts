import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * delete a specified poll
 * @param {number} id - id of the poll you want to delete
*/
export async function deletePoll(id: number) {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  const deletedPoll = await db
    .delete(schema.questions)
    .where(eq(schema.questions.id, id))
    .returning()

  await db
    .delete(schema.answers)
    .where(eq(schema.answers.questionId, id))

  return deletedPoll
}
