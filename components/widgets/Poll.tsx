"use client"
import { Poll } from "@/types/Poll";
import { useMemo, useState } from "react";
import Button from "../Button";
import { voteAnswer } from "@/lib/drizzle/voteAnswer";
import Chart from "../Chart";

export default function PollWidget({ poll }: { poll: Poll }) {
  const [selectedAnswer, setSelectedAnswer] = useState(0)
  const [state, setState] = useState<"question" | "answered">("question")
  const [answers, setAnswers] = useState(poll[0].answers)

  const data = useMemo(
    () => answers.map(answer => ({ name: answer.answer, votes: answer.votes })),
    [answers]
  )
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(Number(event.target.value))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (selectedAnswer == null) return
    const result = await voteAnswer(selectedAnswer)
    if (result.succes) {
      setAnswers(prev => prev.map(answer => (answer.id === selectedAnswer ? { ...answer, votes: answer.votes || 0 + 1 } : answer)))
      setState("answered")
    }
  };


  return (
    <>
      {state === "question" ? (
        <form onSubmit={handleSubmit}>
          <h1>{poll[0].question}</h1>
          {poll[0].answers.map(answer => (
            <label key={answer.id}>
              <input
                type="radio"
                name="answer"
                value={answer.id}
                onChange={handleChange}
                checked={selectedAnswer === answer.id}
              />
              {answer.answer}<br />
            </label>
          ))}
          <Button text="Abstimmen" href="#" type="submit"></Button>
        </form >
      ) : (
        <>
          <Chart data={data} />
        </>
      )}
    </>
  )
}
