"use server"
import * as schema from '@/db/schema';
import { count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

export async function getRandomPoll() {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  const totalQuestions = await db.select({ count: count() }).from(schema.questions)

  const result = await db.query.questions.findMany({
    limit: 1,
    offset: Math.floor(Math.random() * totalQuestions[0].count),
    with: {
      answers: true
    },
  });

  return result
}
