"use client"

import sendComment from "@/lib/wpRest/sendComment"
import { useActionState } from "react"
import Button from "./Button"

const initalState = { message: "" }

export default function CommentForm({ postId }: { postId: number }) {
  async function sendCommentWithId(
    state: typeof initalState,
    formData: FormData
  ) {
    return await sendComment(postId, formData)
  }
  const [state, formAction, pending] = useActionState(sendCommentWithId, initalState)

  return (
    <form action={formAction}>
      <label>
        Author
        <input name="author" required />
      </label>
      <label>
        Kommentar
        <textarea name="content" required />
      </label>
      <Button text="Absenden" href="#" type="submit" disabled={pending} />
      <p>{state.message}</p>
    </form>
  )
}
