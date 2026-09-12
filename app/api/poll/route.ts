import { addPoll } from "@/lib/drizzle/addPoll";
import { getPolls } from "@/lib/drizzle/getPolls";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET() {
  try {
    const polls = await getPolls()
    return Response.json(polls)
  } catch {
    return Response.json({ error: "Failed to load polls" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const schema = z.object({
      question: z.string(),
      answers: z.array(z.string())
    })

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid JSON", details: parsed.error }, { status: 400 })
    }
    return Response.json(await addPoll(body.question, body.answers))
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
}

