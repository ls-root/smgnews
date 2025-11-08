import AuthorCard from "@/components/AuthorCard"
import Button from "@/components/Button"
import Categories from "@/components/Categories"
import DOMPurify from "@/components/DOMPurify"
import getPost from "@/lib/wpRest/getPost"
import Image from "next/image"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ article: string }>
}) {
  const { article } = await params
  const post = await getPost(article)

  const imageSize = post?.featuredMedia?.sizes.medium_large
    || post?.featuredMedia?.sizes.full
    || post?.featuredMedia?.sizes.medium
    || post?.featuredMedia?.sizes.thumbnail

  return (
    <>
      {post === null ? (
        <>
          <p>Dieser Aritkel konnte nicht geladen werden</p>
          <Button text="Zurück zur Startseite" href="/" />
        </>
      ) : (
        <>

          {post.featuredMediaAvailable && imageSize && (
            <Image
              width={imageSize.width}
              height={imageSize.height}
              src={imageSize.sourceUrl}
              alt={post.featuredMedia?.alt || ""}
              className="w-2xs"
            />
          )}
          <h1>{post.title}</h1>
          <Categories slug={post.slug} />
          <AuthorCard
            name={post.author.name}
            description={post.author.description}
            pfp={post.author.avatarUrl}
            id={post.author.id}
          />
          <DOMPurify html={post.content} />
        </>
      )}
    </>
  )
}
