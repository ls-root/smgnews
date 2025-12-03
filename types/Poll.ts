export type Poll = {
  id: number,
  question: string | null,
  answers: {
    id: number,
    answer: string | null,
    votes: number | null,
    questionId: number | null
  }[]
}[]
