// app/api/poll/[slug]/route.ts
import { addPoll } from '@/lib/drizzle/addPoll';
import { deletePoll } from '@/lib/drizzle/deletePoll';
import { getPoll } from '@/lib/drizzle/getPoll';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ poll: string }> }
) {
  const { poll } = await params
  const pollId = Number(poll)
  const pollFull = await getPoll(pollId)
  return Response.json(pollFull)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ poll: string }> }
) {
  const { poll } = await params
  const pollId = Number(poll)
  const deletedPoll = deletePoll(pollId)
  return Response.json(deletedPoll)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ poll: string }> }
) {
  const { poll } = await params
  const pollId = Number(poll)
  try {
    const body = await req.json()
    // JSON schema validation
    if (typeof body.question !== "string" ||
      !Array.isArray(body.answers) ||
      body.answers.filter((a: unknown): a is string => typeof a === "string").length === 0) {
      return Response.json({ error: "Invalid JSON" }, { status: 400 })
    }
    return Response.json(await addPoll(body.question, body.answers, pollId))
  } catch (error) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
