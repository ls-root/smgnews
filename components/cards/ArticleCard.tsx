import { Post } from "@/types/Post";
import Image from "next/image";
import Categories from "../Categories";
import Button from "../Button";
import DOMPurify from "@/components/DOMPurify";

export default function ArticleCard({ post, key }: { post: Post, key: string }) {
  const imageSize = post.featuredMedia?.sizes.thumbnail
    || post.featuredMedia?.sizes.medium
    || post.featuredMedia?.sizes.medium_large
    || post.featuredMedia?.sizes.full

  return (
    <li
      key={key}
      className="
              overflow-hidden flex w-full max-w-3xl flex-row
              glass rounded-4xl min-h-72
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
      <div className="w-full flex flex-col justify-between p-4 ">
        <div className="space-y-2">
          <h3 className="text-blue-950 antialiased font-bold font-3xl md:text-xl lg:text-2xl mb-2">
            {post.title}
          </h3>
          <Categories slug={post.slug} />
          <DOMPurify html={post.excerpt} />
        </div>
        <div className="flex justify-end">
          <Button href={"/artikel/" + post.slug}>
            Weiterlesen
          </Button>

        </div>
      </div>
    </li>
  )

}
