import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';

/**
 * add stars to an article
 * @param {number} postId - WP post ID of the post you want to vote
 * @param {number} stars - number of stars you want to give the post
 * @param {string} anonId - anon ID of user who rates. Anon ID can be found in X-ANON-ID cookie
*/
export default async function voteStars(postId: number, stars: number, anonId: string) {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  const [user] = await db.select().from(schema.anonymousUsers).where(eq(schema.anonymousUsers.anonId, anonId))

  if (user === undefined) {
    await db.insert(schema.anonymousUsers).values({ anonId: anonId }).onConflictDoNothing().returning()
  }

  await db.insert(schema.stars)
    .values({ postId, stars, anonymousUserId: anonId })
    .onConflictDoUpdate({
      target: [schema.stars.anonymousUserId, schema.stars.postId],
      set: { stars: sql`excluded.stars` }
    })
  // await db.insert(schema.stars).values({ postId: postId, stars: stars, anonymousUserId: user.anonId })
}
