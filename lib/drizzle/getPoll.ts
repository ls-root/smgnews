import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * get specified poll with answer
 * @param {number} id - id of the poll you want to get
*/
export async function getPoll(id: number) {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  const result = await db.query.questions.findMany({
    where: eq(schema.questions.id, id),
    limit: 1,
    with: {
      answers: true
    },
  });

  return result
}
