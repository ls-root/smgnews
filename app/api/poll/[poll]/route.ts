// app/api/poll/[slug]/route.ts
import { addPoll } from '@/lib/drizzle/addPoll';
import { deletePoll } from '@/lib/drizzle/deletePoll';
import { getPoll } from '@/lib/drizzle/getPoll';
import { NextRequest } from 'next/server';
import z from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ poll: string }> }
) {
  const { poll } = await params
  const pollId = Number(poll)
  if (!Number.isInteger(pollId)) {
    return Response.json({ error: "Invalid poll id" }, { status: 400 })
  }
  try {
    const pollFull = await getPoll(pollId)
    return Response.json(pollFull)
  } catch {
    return Response.json({ error: "Failed to load poll" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ poll: string }> }
) {
  const { poll } = await params
  const pollId = Number(poll)
  if (!Number.isInteger(pollId)) {
    return Response.json({ error: "Invalid poll id" }, { status: 400 })
  }
  try {
    const deletedPoll = await deletePoll(pollId)
    return Response.json(deletedPoll)
  } catch {
    return Response.json({ error: "Failed to delete poll" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ poll: string }> }
) {
  const { poll } = await params
  const pollId = Number(poll)
  if (!Number.isInteger(pollId)) {
    return Response.json({ error: "Invalid poll id" }, { status: 400 })
  }
  try {
    const body = await req.json()
    // JSON schema validation
    const schema = z.object({
      question: z.string(),
      answers: z.array(z.string())
    })

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid JSON", details: parsed.error })
    }

    return Response.json(await addPoll(body.question, body.answers, pollId))
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
