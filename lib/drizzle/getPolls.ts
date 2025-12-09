import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * get all polls with only question and id from the database
*/
export async function getPolls() {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  const polls = await db.select().from(schema.questions)

  return polls
}
