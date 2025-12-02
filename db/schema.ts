import { relations } from "drizzle-orm";
import { pgTable, text, serial, varchar, integer, uniqueIndex } from "drizzle-orm/pg-core";

export const stars = pgTable("stars", {
  id: serial("id").primaryKey(),
  postId: integer("post_id"),
  stars: integer(),
  anonymousUserId: varchar("anonymous_user_id").notNull()
}, (table) => [
  uniqueIndex("stars_user_post_unique").on(table.anonymousUserId, table.postId)
])

export const starsRelations = relations(stars, ({ one }) => ({
  anonymousUser: one(anonymousUsers, {
    fields: [stars.anonymousUserId],
    references: [anonymousUsers.anonId]
  })
}))

export const anonymousUsers = pgTable(
  "anonymousUsers",
  {
    id: serial("id").primaryKey(),
    anonId: varchar("anon_id").notNull()
  },
  (table) => [
    uniqueIndex("anonIdUniqueIndex").on(table.anonId)
  ]
)

export const anonymousUsersRelations = relations(anonymousUsers, ({ many }) => ({
  posts: many(stars)
}))

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text()
})

export const questionsRelations = relations(questions, ({ many }) => ({
  answers: many(answers)
}))

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  answer: varchar({ length: 256 }),
  votes: integer().default(0),
  questionId: integer("question_id")
})

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id]
  })
}))
