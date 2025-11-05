import { Post } from "@/types/Post"
import { PaginationInfo } from "@/types/PaginationInfo"
import { WpPost } from "@/types/wpRest/WpPost";

async function getPosts(perPage: number = 10, page: number = 1) {
  if (!process.env.NEXT_PUBLIC_WP_REST_ENDPOINT) {
    throw new Error("NEXT_PUBLIC_WP_REST_ENDPOINT is not defined");
  }

  const postResponse = await fetch(
    `${process.env.NEXT_PUBLIC_WP_REST_ENDPOINT}/posts?per_page=${perPage}&page=${page}&_embed`
  )

  if (!postResponse.ok) {
    throw new Error(`Failed to fetch posts: ${postResponse.status} ${postResponse.statusText}`)
  }

  const totalPages = parseInt(postResponse.headers.get("x-wp-totalpages") || "0")

  const paginationInfo: PaginationInfo = {
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }

  const wpPosts: WpPost[] = await postResponse.json()

  const posts: Post[] = wpPosts.map(wpPost => {
    const featuredMediaData = wpPost._embedded?.["wp:featuredmedia"]?.[0]
    const hasFeaturedMedia = wpPost.featured_media !== 0 && featuredMediaData !== undefined

    const getSizeData = (sizeName: "medium" | "thumbnail" | "medium_large" | "full") => {
      const size = featuredMediaData?.media_details?.sizes?.[sizeName]
      return size ? {
        width: size.width,
        height: size.height,
        sourceUrl: size.source_url
      } : undefined
    }

    return {
      id: wpPost.id,
      title: wpPost.title.rendered,
      slug: wpPost.slug,
      excerpt: wpPost.excerpt.rendered,
      content: wpPost.content.rendered,
      featuredMediaAvailable: hasFeaturedMedia,
      featuredMedia: hasFeaturedMedia && featuredMediaData ? {
        alt: featuredMediaData.alt_text,
        sizes: {
          medium: getSizeData("medium"),
          thumbnail: getSizeData("thumbnail"),
          medium_large: getSizeData("medium_large"),
          full: getSizeData("full")
        }
      } : undefined
    }
  })


  return { posts, pagination: paginationInfo }
}

export default getPosts
