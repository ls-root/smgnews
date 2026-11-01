"use server"
import { getMainEndpoint } from "./getWpEndpoints";

/**
 * send comment to WP instance
 * @param {number} postId - WP post ID
 * @param {FormData} formData - author and content as formData
 */
async function sendComment(postId: number, formData: FormData) {
  const endpoint = getMainEndpoint();

  const content = formData.get("content");
  const author = formData.get("author");

  const commentsResponse = await fetch(
    `${endpoint}/comments?post=${postId}&content=${content}&author_name=${author}&author_email=comments@wp.fiosproject.de`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(process.env.WP_COMMENTS_USERNAME + ":" + process.env.WP_COMMENTS_APPLICATION_PASSWORD).toString("base64"),
    }
  }
  )

  if (!commentsResponse.ok) {
    throw new Error(`Failed to send comment: ${commentsResponse.status} ${commentsResponse.statusText}`)
  }

  return {
    message: commentsResponse.ok
      ? "Dein Kommentar wurde gesendet und wartet auf Freigabe."
      : "Fehler beim senden deines Kommentares."
  }
}

export default sendComment
