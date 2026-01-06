import AuthorCard from "@/components/cards/AuthorCard"
import Categories from "@/components/Categories"
import CommentForm from "@/components/CommentForm"
import DOMPurify from "@/components/DOMPurify"
import SetHeader from "@/components/SetHeader"
import StarRating from "@/components/StarRating"
import textOnly from "@/lib/textOnly"
import getComments from "@/lib/wpRest/getComments"
import getPosts from "@/lib/wpRest/getPosts"
import getUsers from "@/lib/wpRest/getUsers"
import { notFound } from "next/navigation"

export default async function ArticlePage({
  params,
  searchParams
}: {
  params: Promise<{ article: string }>,
  searchParams: Promise<{ page?: string }>
}) {
  const { article } = await params
  const { page } = await searchParams
  const currentPage = Math.max(0, Number(page ?? 0))
  const post = await getPosts(1, 1, { slug: article })
  const postAvailable = post.posts.length > 0

  if (!postAvailable) notFound()

  const comments = postAvailable && await getComments(post.posts[0].id)
  const inactive = postAvailable && (await getUsers(1, post.posts[0].author.name)).users[0].roles.includes("inactive")

  return (
    <>
      <SetHeader
        title={post.posts[0].title}
        subtitle=" "
        image={post.posts[0].featuredMedia?.sizes.full?.sourceUrl || "/header.jpg"}
        subcontent={<Categories slug={post.posts[0].slug} />}
      />
      <DOMPurify html={post.posts[0].content} renderWP page={currentPage} />
      <div className="block md:flex space-x-5">
        <AuthorCard
          name={post.posts[0].author.name}
          variant="horizontal"
          description={post.posts[0].author.description}
          pfp={post.posts[0].author.avatarUrl}
          id={post.posts[0].author.id}
          inactive={inactive}
          className="w-full md:w-fit mb-4"
        />
        <StarRating postId={post.posts[0].id} />
      </div>
      <div className="glass rounded-3xl mt-5 p-2">
        <h3>Kommentare</h3>
        <CommentForm postId={post.posts[0].id} />
        {comments.map(comment => (
          <div className="rounded-2xl mt-2 glass p-2 max-w-3xl" key={comment.id}>
            <h5>{comment.authorName} ({new Date(comment.date).toLocaleDateString("de-DE")})</h5>
            <p>{textOnly(comment.content)}</p>
          </div>
        ))}
      </div>
    </>
  )
}
