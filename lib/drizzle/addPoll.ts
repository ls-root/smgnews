import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { deletePoll } from './deletePoll';

/**
 * add a poll
*/
export async function addPoll(question: string, answers: string[], questionIdUpdate?: number) {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  if (questionIdUpdate) {
    deletePoll(questionIdUpdate)
  }

  const questionId = await db
    .insert(schema.questions)
    .values({ question })
    .returning({ questionId: schema.questions.id })

  answers.forEach(async (answer) => {
    await db
      .insert(schema.answers)
      .values({ questionId: questionId[0].questionId, answer })
  })

  return questionId
}
