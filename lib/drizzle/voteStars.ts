import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';

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
