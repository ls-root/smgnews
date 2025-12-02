"use server"
import * as schema from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * get stars of a post
 * @param {number} postId - ID of post you want to get stars of
 * @param {string} [anonId] - If set filter for ratings by user
*/
export async function getStars(postId: number, anonId?: string) {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  if (anonId == null) {
    return await db.select().from(schema.stars).where(eq(schema.stars.postId, postId))
  }

  return await db.select().from(schema.stars).where(and(
    eq(schema.stars.postId, postId),
    eq(schema.stars.anonymousUserId, anonId)
  ))
}
