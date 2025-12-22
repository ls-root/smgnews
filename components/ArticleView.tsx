import getPosts from "../lib/wpRest/getPosts"
import Pagination from "./Pagination"
import ArticleCard from "./cards/ArticleCard"

export default async function ArticleView({
  author, category, page
}: {
  author?: string, category?: number, page: number
}) {
  const posts = await getPosts(5, page, { authorSlug: author, category: category })

  return (
    <>
      <ul className="space-y-4">
        {posts.posts.map(post => (<ArticleCard post={post} key={post.slug} />))}
      </ul>
      <Pagination
        hasNextPage={posts.pagination.hasNextPage}
        hasPreviousPage={posts.pagination.hasPreviousPage}
        currentPage={posts.pagination.currentPage}
        totalPages={posts.pagination.totalPages}
      />
    </>
  )
}
