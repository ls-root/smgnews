import { Post } from "@/types/Post"
import { PaginationInfo } from "@/types/PaginationInfo"
import { WpPost } from "@/types/wpRest/WpPost";
import getUsers from "./getUsers";
import { User } from "@/types/User";

async function getPosts(perPage: number = 10, page: number = 1, authorSlug?: string) {
  if (!process.env.NEXT_PUBLIC_WP_REST_ENDPOINT) {
    throw new Error("NEXT_PUBLIC_WP_REST_ENDPOINT is not defined");
  }

  let authorId = "";

  if (authorSlug) {
    const author: User[] = await getUsers(authorSlug)
    if (author.length > 0) {
      authorId = author[0].id.toString()
    }
  }

  const postResponse = await fetch(
    `${process.env.NEXT_PUBLIC_WP_REST_ENDPOINT}/posts?per_page=${perPage}&page=${page}&author=${authorId}&_embed`
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

    const categories = wpPost._embedded?.["wp:term"]?.[0]?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      link: cat.link // TODO: Real route
    })) || [{
      id: 1,
      name: "Keine Kategorie",
      slug: "uncategorized",
      link: "/kategorie/uncategorized" // TODO: /kategorie route
    }]

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
      categories: categories,
      author: {
        id: wpPost._embedded.author[0].id,
        name: wpPost._embedded.author[0].name,
        description: wpPost._embedded.author[0].description,
        avatarUrl: wpPost._embedded.author[0].avatar_urls[96]
      },
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
