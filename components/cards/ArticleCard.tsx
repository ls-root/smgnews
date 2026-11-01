import { Post } from "@/types/Post";
import Image from "next/image";
import Categories from "../Categories";
import Button from "../Button";
import DOMPurify from "@/components/DOMPurify";

export default function ArticleCard({ post }: { post: Post }) {
  const imageSize = post.featuredMedia?.sizes.medium_large
    || post.featuredMedia?.sizes.full
    || post.featuredMedia?.sizes.medium
    || post.featuredMedia?.sizes.thumbnail

  const sourceUrl = imageSize?.sourceUrl || post.featuredMedia?.sourceUrl
  const width = imageSize?.width || post.featuredMedia?.width || 0
  const height = imageSize?.height || post.featuredMedia?.height || 0

  return (
    <li
      key={post.link}
      className="
        group relative overflow-hidden flex w-full max-w-3xl flex-row
        glass rounded-4xl min-h-64
        transition duration-300
      "
    >
      {post.featuredMediaAvailable && sourceUrl && (
        <div className="hidden md:block md:w-2/5 shrink-0 overflow-hidden rounded-l-4xl">
          <Image
            className="size-full object-cover transition duration-500 group-hover:scale-105"
            width={width}
            height={height}
            src={sourceUrl}
            alt={post.featuredMedia?.alt || ""}
            sizes="(min-width: 768px) 307px, 100vw"
            quality={90}
          />
        </div>
      )}
      <div className="w-full flex flex-col justify-between p-5 md:p-6">
        <div className="space-y-3">
          <h3 className="text-blue-950 antialiased font-bold text-xl md:text-2xl leading-snug">
            {post.title}
          </h3>
          <Categories categories={post.categories} />
          <div className="text-sm leading-relaxed text-blue-950/70 [&_p]:m-0">
            <DOMPurify html={post.excerpt} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button href={post.link}>
            Weiterlesen
          </Button>
        </div>
      </div>
    </li>
  )
}
