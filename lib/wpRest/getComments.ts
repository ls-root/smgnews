import { Comment } from "@/types/Comment";
import { WpComments } from "@/types/wpRest/WPComment";
import { getMainEndpoint } from "./getWpEndpoints";

/**
 * get Comments of an article
 * @param {number} articleId - WP post ID
 */
async function getComments(articleId: number) {
  const endpoint = getMainEndpoint();

  const commentsResponse = await fetch(
    `${endpoint}/comments?post=${articleId}`, {
    headers: {
      Authorization: "Basic " + Buffer.from(process.env.WP_COMMENTS_USERNAME + ":" + process.env.WP_COMMENTS_APPLICATION_PASSWORD).toString("base64"),
    }
  }
  )

  if (!commentsResponse.ok) {
    throw new Error(`Failed to fetch comments: ${commentsResponse.status} ${commentsResponse.statusText}`)
  }

  const wpComments: WpComments[] = await commentsResponse.json()

  const comments: Comment[] = wpComments.map(comment => {
    return {
      id: comment.id,
      post: comment.post,
      content: comment.content.rendered,
      date: comment.date_gmt,
      authorName: comment.author_name,
    }
  })
  return comments
}

export default getComments
