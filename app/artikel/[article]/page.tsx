import AuthorCard from "@/components/AuthorCard"
import Button from "@/components/Button"
import Categories from "@/components/Categories"
import CommentForm from "@/components/CommentForm"
import DOMPurify from "@/components/DOMPurify"
import SetHeader from "@/components/SetHeader"
import StarRating from "@/components/StarRating"
import textOnly from "@/lib/textOnly"
import getComments from "@/lib/wpRest/getComments"
import getPosts from "@/lib/wpRest/getPosts"
import getUsers from "@/lib/wpRest/getUsers"
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
  const inactive = (await getUsers(1, post.posts[0].author.name)).users[0].roles.includes("inactive")

  return (
    <>
      {post === null ? (
        <>
          <p>Dieser Aritkel konnte nicht geladen werden</p>
          <Button href="/">Zurück zur Startseite</Button>
        </>
      ) : (
        <>
          <SetHeader
            title={post.posts[0].title}
            subtitle=" "
            image={post.posts[0].featuredMedia?.sizes.full?.sourceUrl || "/header.jpg"}
            subcontent={<Categories slug={post.posts[0].slug} />}
          />
          <DOMPurify html={post.posts[0].content} />
          <div className="flex space-x-5">
            <AuthorCard
              name={post.posts[0].author.name}
              variant="horizontal"
              description={post.posts[0].author.description}
              pfp={post.posts[0].author.avatarUrl}
              id={post.posts[0].author.id}
              inactive={inactive}
            />
            <StarRating postId={post.posts[0].id} />
          </div>
          <div className="glass rounded-3xl mt-5 p-2">
            <h1 className="text-3xl font-semibold text-blue-950">Kommentare</h1>
            <CommentForm postId={post.posts[0].id} />
            {comments.map(comment => (
              <div className="rounded-2xl mt-2 glass p-2 max-w-3xl" key={comment.id}>
                <h3>{comment.authorName} ({new Date(comment.date).toLocaleDateString("de-DE")})</h3>
                <p>{textOnly(comment.content)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
