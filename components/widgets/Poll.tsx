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
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-4">
          <h1>{poll[0].question}</h1>
          {poll[0].answers.map(answer => (
            <label key={answer.id} className="
            flex glass p-2 rounded-3xl duration-500 my-3 text-blue-950 active:bg-blue-300/75
            hover:bg-blue-300/50 hover:text-blue-800 hover:font-black
            ">
              <input
                className="mr-2"
                type="radio"
                name="answer"
                value={answer.id}
                onChange={handleChange}
                checked={selectedAnswer === answer.id}
              />
              {answer.answer}<br />
            </label>
          ))}
          <Button href="#" type="submit">Abstimmen</Button>
        </form >
      ) : (
        <div className="glass rounded-3xl p-2">
          <Chart data={data} />
        </div>
      )}
    </>
  )
}
