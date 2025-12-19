import { addPoll } from "@/lib/drizzle/addPoll";
import { getPolls } from "@/lib/drizzle/getPolls";
import { error } from "console";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  const polls = await getPolls()

  return Response.json(polls)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const schema = z.object({
      question: z.string(),
      answers: z.array(z.string())
    })

    if (!schema.safeParse(body).success) {
      return Response.json({ error: "Invalid JSON", details: schema.safeParse(body).error })
    }
    return Response.json(await addPoll(body.question, body.answers))
  } catch (error) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
}

