import getPosts from "../lib/wpGraphql/getPosts"
import PostExcerpt from "@/components/PostExcerpt"
import Image from "next/image"

export default async function HomePage() {
  const posts = await getPosts(5)

  return (
    <ul>
      {posts.map(post => (
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
  )
}
