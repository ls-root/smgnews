import getPosts from "../lib/wpGraphql/getPosts"
import PostExcerpt from "@/components/PostExcerpt"
import Image from "next/image"

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const afterParam = Array.isArray(resolvedSearchParams.after)
    ? resolvedSearchParams.after[0]
    : resolvedSearchParams.after
  const posts = await getPosts(5, afterParam)

  return (
    <>
      <p>After: {posts.pageInfo?.endCursor}</p>
      <ul>
        {posts.posts.map(post => (
          <li key={post.id} className="border border-black">
            {post.featuredImage?.node?.sourceUrl && (
              <Image
                height={post.featuredImage.node.mediaDetails.height}
                width={post.featuredImage.node.mediaDetails.width}
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText}
                className="w-2xs"
              />
            )}
            <h2>{post.title} ({post.id})</h2>
            <PostExcerpt excerpt={post.excerpt} />
          </li>
        ))}
      </ul>
    </>
  )
}
