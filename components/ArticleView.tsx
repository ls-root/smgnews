import getPosts from "../lib/wpRest/getPosts"
import PostExcerpt from "@/components/DOMPurify"
import Image from "next/image"
import Button from "@/components/Button"
import Categories from "@/components/Categories"
import Pagination from "./Pagination"

export default async function ArticleView({
  author, category, page
}: {
  author?: string, category?: number, page: number
}) {
  const posts = await getPosts(5, page, { authorSlug: author, category: category })

  return (
    <>
      <ul>
        {posts.posts.map(post => {
          const imageSize = post.featuredMedia?.sizes.thumbnail
            || post.featuredMedia?.sizes.medium
            || post.featuredMedia?.sizes.medium_large
            || post.featuredMedia?.sizes.full

          return (
            <li
              key={post.id}
              className="
              overflow-hidden flex h-full w-full max-w-3xl flex-row
              glass rounded-4xl mb-4
              "
            >
              {post.featuredMediaAvailable && imageSize && (
                <Image
                  className="w-2/3 object-cover rounded-3xl"
                  width={imageSize.width}
                  height={imageSize.height}
                  src={imageSize.sourceUrl}
                  alt={post.featuredMedia?.alt || ""}
                />
              )}
              <div className="w-full h-max rounded p-4">
                <h2 className="text-blue-950 antialiased font-bold font-3xl md:text-xl lg:text-2xl mb-2">
                  {post.title}
                </h2>
                <Categories slug={post.slug} />
                <PostExcerpt html={post.excerpt} />
                <Button href={"/artikel/" + post.slug}>
                  Weiterlesen
                </Button>
              </div>
            </li>
          )
        })}
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
