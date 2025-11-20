export type Poll = {
  id: number,
  question: string,
  answers: {
    id: number,
    answer: string,
    votes: number,
    questionId: number
  }[]
}[]
