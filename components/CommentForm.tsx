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
      <label htmlFor="author">
        Author
      </label>
      <input name="author" required className="glass rounded-3xl ml-2 outline-none p-0.5" /><br />
      <label htmlFor="content">
        Kommentar
      </label>
      <textarea name="content" required className="glass rounded-2xl ml-2 mt-2 outline-none p-0.5" /><br />
      <Button href="#" type="submit" disabled={pending}>Absenden</Button>
      <p>{state.message}</p>
    </form>
  )
}
