import AuthorCard from "@/components/AuthorCard"
import Button from "@/components/Button"
import Categories from "@/components/Categories"
import CommentForm from "@/components/CommentForm"
import DOMPurify from "@/components/DOMPurify"
import textOnly from "@/lib/textOnly"
import getComments from "@/lib/wpRest/getComments"
import getPosts from "@/lib/wpRest/getPosts"
import sendComment from "@/lib/wpRest/sendComment"
import Image from "next/image"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ article: string }>
}) {
  const { article } = await params
  const post = await getPosts(1, 1, { slug: article })

  const imageSize = post.posts[0]?.featuredMedia?.sizes.medium_large
    || post.posts[0]?.featuredMedia?.sizes.full
    || post.posts[0]?.featuredMedia?.sizes.medium
    || post.posts[0]?.featuredMedia?.sizes.thumbnail

  const comments = await getComments(post.posts[0].id)
  const sendCommentWithId = sendComment.bind(null, post.posts[0].id)

  return (
    <>
      {post === null ? (
        <>
          <p>Dieser Aritkel konnte nicht geladen werden</p>
          <Button text="Zurück zur Startseite" href="/" />
        </>
      ) : (
        <>
          {post.posts[0].featuredMediaAvailable && imageSize && (
            <Image
              width={imageSize.width}
              height={imageSize.height}
              src={imageSize.sourceUrl}
              alt={post.posts[0].featuredMedia?.alt || ""}
              className="w-2xs"
            />
          )}
          <h1>{post.posts[0].title}</h1>
          <Categories slug={post.posts[0].slug} />
          <AuthorCard
            name={post.posts[0].author.name}
            variant="horizontal"
            description={post.posts[0].author.description}
            pfp={post.posts[0].author.avatarUrl}
            id={post.posts[0].author.id}
          />
          <DOMPurify html={post.posts[0].content} />
          <h1>Kommentare</h1>
          <CommentForm postId={post.posts[0].id} />
          {comments.map(comment => (
            <div className="border border-black max-w-3xl" key={comment.id}>
              <h3>{comment.authorName} ({new Date(comment.date).toLocaleDateString("en-US")})</h3>
              <p>{textOnly(comment.content)}</p>
            </div>
          ))}
        </>
      )}
    </>
  )
}
