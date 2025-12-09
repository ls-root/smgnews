import { addPoll } from "@/lib/drizzle/addPoll";
import { getPolls } from "@/lib/drizzle/getPolls";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const polls = await getPolls()

  return Response.json(polls)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // JSON schema validation
    if (typeof body.question !== "string" ||
      !Array.isArray(body.answers) ||
      body.answers.filter((a: unknown): a is string => typeof a === "string").length === 0) {
      return Response.json({ error: "Invalid JSON" }, { status: 400 })
    }
    return Response.json(await addPoll(body.question, body.answers))
  } catch (error) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
