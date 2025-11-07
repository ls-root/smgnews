import Pagination from "@/components/Pagination"
import getPosts from "../lib/wpRest/getPosts"
import PostExcerpt from "@/components/DOMPurify"
import Image from "next/image"
import Button from "@/components/Button"
import Categories from "@/components/Categories"

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pageParam = params.page
  const pageStr = typeof pageParam === "string"
    ? pageParam
    : Array.isArray(pageParam)
      ? pageParam[0]
      : undefined
  const page = pageStr ? parseInt(pageStr, 10) : undefined
  const validPage = page && !isNaN(page) ? page : 1
  const posts = await getPosts(5, validPage)

  return (
    <>
      <Pagination
        currentPage={posts.pagination.currentPage}
        hasNextPage={posts.pagination.hasNextPage}
        hasPreviousPage={posts.pagination.hasPreviousPage}
        totalPages={posts.pagination.totalPages}
      />
      <ul>
        {posts.posts.map(post => {
          const imageSize = post.featuredMedia?.sizes.thumbnail
            || post.featuredMedia?.sizes.medium
            || post.featuredMedia?.sizes.medium_large
            || post.featuredMedia?.sizes.full

          return (
            <li key={post.id} className="border border-black">
              {post.featuredMediaAvailable && imageSize && (
                <Image
                  width={imageSize.width}
                  height={imageSize.height}
                  src={imageSize.sourceUrl}
                  alt={post.featuredMedia?.alt || ""}
                  className="w-2xs"
                />
              )}
              <h2>{post.title} ({post.id})</h2>
              <Categories slug={post.slug} />
              <PostExcerpt html={post.excerpt} />
              <Button
                text={"Weiterlesen (" + post.slug + ")"}
                href={"/artikel/" + post.slug}
              />
            </li>
          )
        })}
      </ul>
    </>
  )
}
