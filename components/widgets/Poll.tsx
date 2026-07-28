"use client"
import { BarChart3 } from "lucide-react";
import { Poll } from "@/types/Poll";
import { useMemo, useState } from "react";
import Button from "../Button";
import { voteAnswer } from "@/lib/drizzle/voteAnswer";
import Chart from "../Chart";
import WidgetSection from "./WidgetSection";

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
        <WidgetSection title="Umfrage" icon={BarChart3}>
          <form onSubmit={handleSubmit}>
            <p className="font-semibold text-blue-950 mb-3">{poll[0].question}</p>
            <div className="space-y-2">
              {poll[0].answers.map(answer => {
                const checked = selectedAnswer === answer.id
                return (
                  <label key={answer.id} className={`
                    flex items-center gap-2 cursor-pointer rounded-2xl border-2 p-2.5 duration-300 text-blue-950
                    ${checked
                      ? "border-accent bg-blue-200/60 font-bold"
                      : "border-blue-300/50 bg-blue-100/40 hover:bg-blue-200/50 hover:border-blue-300"}
                  `}>
                    <input
                      className="sr-only"
                      type="radio"
                      name="answer"
                      value={answer.id}
                      onChange={handleChange}
                      checked={checked}
                    />
                    <span className={`
                      grid place-items-center size-5 rounded-full border-2 shrink-0 transition
                      ${checked ? "border-accent" : "border-blue-400"}
                    `}>
                      {checked && <span className="size-2.5 rounded-full bg-accent" />}
                    </span>
                    <span>{answer.answer}</span>
                  </label>
                )
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <Button href="#" type="submit">Abstimmen</Button>
            </div>
          </form>
        </WidgetSection>
      ) : (
        <WidgetSection title="Umfrage" icon={BarChart3}>
          <Chart data={data} />
        </WidgetSection>
      )}
    </>
  )
}
