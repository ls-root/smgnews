import { relations } from "drizzle-orm";
import { pgTable, text, serial, varchar, integer } from "drizzle-orm/pg-core";

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
