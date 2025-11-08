import AuthorCard from "@/components/AuthorCard"
import Button from "@/components/Button"
import Categories from "@/components/Categories"
import DOMPurify from "@/components/DOMPurify"
import getPosts from "@/lib/wpRest/getPosts"
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
            description={post.posts[0].author.description}
            pfp={post.posts[0].author.avatarUrl}
            id={post.posts[0].author.id}
          />
          <DOMPurify html={post.posts[0].content} />
        </>
      )}
    </>
  )
}
