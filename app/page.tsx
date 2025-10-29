import getPosts from "../lib/wpGraphql/getPosts"
import PostExcerpt from "@/components/PostExcerpt"

export default async function HomePage() {
  const posts = await getPosts(5)

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <h2>{post.title} ({post.id})</h2>
          <PostExcerpt excerpt={post.excerpt} />
        </li>
      ))}
    </ul>
  )
}
