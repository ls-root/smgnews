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
    const schema = z.object({
      question: z.string(),
      answers: z.array(z.string())
    })

    if (!schema.safeParse(body).success) {
      return Response.json({ error: "Invalid JSON", details: schema.safeParse(body).error })
    }

    return Response.json(await addPoll(body.question, body.answers, pollId))
  } catch (error) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
