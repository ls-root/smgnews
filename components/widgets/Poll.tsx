"use client"
import { Poll } from "@/types/Poll";
import { useState } from "react";
import Button from "../Button";
import { voteAnswer } from "@/lib/drizzle/voteAnswer";
import Chart from "../Chart";

export default function PollWidget({ poll }: { poll: Poll }) {
  const [selectedAnswer, setSelectedAnswer] = useState(0)
  const [state, setState] = useState<"question" | "answered">("question")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(Number(event.target.value))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await voteAnswer(selectedAnswer)
    if (result.succes) {
      setState("answered")
    }
  };

  const data = poll[0].answers.map(answer => ({ name: answer.answer, votes: answer.votes }))

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
