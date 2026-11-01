import { Post } from "@/types/Post"
import { PaginationInfo } from "@/types/PaginationInfo"
import { WpPost } from "@/types/wpRest/WpPost";
import { WpMedia } from "@/types/wpRest/WpMedia";
import getUsers from "./getUsers";
import { User } from "@/types/User";
import wpLinkToRoute from "@/utils/wpLinkToRoute";
import { getMainEndpoint, getWpEndpoints } from "./getWpEndpoints";

type PostFilterOptions = {
  slug?: string,
  authorSlug?: string,
  category?: number,
  search?: string
}

type PageResult = {
  wpPosts: WpPost[],
  total: number,
  ok: boolean
}

/**
 * Fetches one page from a single WordPress instance.
 */
async function fetchPage(
  endpoint: string,
  isMain: boolean,
  baseParams: URLSearchParams,
  page: number,
  perPage: number
): Promise<PageResult> {
  const params = new URLSearchParams(baseParams)
  params.set("per_page", perPage.toString())
  params.set("page", page.toString())

  try {
    const postResponse = await fetch(`${endpoint}/posts?${params.toString()}`)

    if (!postResponse.ok) {
      // WP answers with 400 when the requested page doesn't exist for this instance.
      if (postResponse.status === 400 && page > 1) {
        return { wpPosts: [], total: 0, ok: true }
      }

      throw new Error(`Failed to fetch posts from ${endpoint}: ${postResponse.status} ${postResponse.statusText}`)
    }

    return {
      wpPosts: await postResponse.json() as WpPost[],
      total: parseInt(postResponse.headers.get("x-wp-total") || "0"),
      ok: true
    }
  } catch (error) {
    // The main feed is required
    if (isMain) throw error

    console.error(`Failed to fetch posts from ${endpoint}`, error)
    return { wpPosts: [], total: 0, ok: false }
  }
}

/**
 * Fetches up to `limit` newest posts from a single WordPress instance.
 */
async function fetchLatestPosts(
  endpoint: string,
  isMain: boolean,
  baseParams: URLSearchParams,
  limit: number
): Promise<PageResult> {
  const perPage = Math.min(100, Math.max(1, limit))
  const wpPosts: WpPost[] = []
  let total = 0
  let page = 1

  while (wpPosts.length < limit) {
    const result = await fetchPage(endpoint, isMain, baseParams, page, perPage)

    if (page === 1) total = result.total
    if (!result.ok) break

    wpPosts.push(...result.wpPosts)

    // No more posts on this instance.
    if (result.wpPosts.length < perPage) break
    if (total > 0 && page >= Math.ceil(total / perPage)) break

    page += 1
  }

  return { wpPosts: wpPosts.slice(0, limit), total, ok: true }
}

function getPostTimestamp(wpPost: WpPost): number {
  return Date.parse(wpPost.date_gmt || wpPost.date) || 0
}

/**
 * get posts on one or more WP instances
 *
 * @param {number} [perPage = 10] - how many posts you want to get
 * @param {number} [page = 1] - offset post response
 * @param filterOptions - filter for slug, author and category
 */
async function getPosts(perPage: number = 10, page: number = 1, filterOptions: PostFilterOptions) {
  const mainEndpoint = getMainEndpoint();

  const hasSiteSpecificFilter = filterOptions.slug !== undefined
    || filterOptions.authorSlug !== undefined
    || filterOptions.category !== undefined

  const endpoints = hasSiteSpecificFilter
    ? [mainEndpoint]
    : getWpEndpoints()

  let authorId = "";

  if (filterOptions.authorSlug) {
    const author: User[] = (await getUsers(1, filterOptions.authorSlug)).users
    if (author.length > 0) {
      authorId = author[0].id.toString()
    }
  }

  const params = new URLSearchParams({
    _embed: "true"
  })

  if (authorId) { params.append("author", authorId) }
  if (filterOptions.slug) { params.append("slug", filterOptions.slug) }
  if (filterOptions.search) { params.append("search", filterOptions.search) }
  if (filterOptions.category !== undefined) { params.append("categories", filterOptions.category.toString()) }

  let postEntries: { endpoint: string, isMain: boolean, wpPost: WpPost }[]
  let totalPages: number

  if (endpoints.length > 1) {
    // To get page N of the merged feed we need enough posts from every
    // instance to cover all positions up to N * perPage.
    const limit = perPage * page

    const results = await Promise.all(endpoints.map((endpoint, index) =>
      fetchLatestPosts(endpoint, index === 0, params, limit)
    ))

    const mergedPosts = results.flatMap((result, index) =>
      result.wpPosts.map(wpPost => ({
        endpoint: endpoints[index],
        isMain: index === 0,
        wpPost
      }))
    )

    mergedPosts.sort((a, b) => getPostTimestamp(b.wpPost) - getPostTimestamp(a.wpPost))

    const start = (page - 1) * perPage
    postEntries = mergedPosts.slice(start, start + perPage)

    const total = results.reduce((sum, result) => sum + result.total, 0)
    totalPages = Math.ceil(total / perPage)
  } else {
    const result = await fetchPage(mainEndpoint, true, params, page, perPage)
    postEntries = result.wpPosts.map(wpPost => ({ endpoint: mainEndpoint, isMain: true, wpPost }))
    totalPages = Math.ceil(result.total / perPage)
  }

  const paginationInfo: PaginationInfo = {
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }

  const fetchMedia = async (endpoint: string, id: number): Promise<WpMedia | undefined> => {
    const res = await fetch(`${endpoint}/media/${id}`)
    if (!res.ok) return undefined
    return res.json()
  }

  const posts: Post[] = await Promise.all(postEntries.map(async ({ endpoint, isMain, wpPost }) => {
    const mediaId = wpPost.featured_media
    let featuredMediaData: WpMedia | undefined = wpPost._embedded?.["wp:featuredmedia"]?.[0]

    if (mediaId !== 0 && !featuredMediaData) {
      featuredMediaData = await fetchMedia(endpoint, mediaId)
    }

    const hasFeaturedMedia = mediaId !== 0 && featuredMediaData !== undefined

    const categories = wpPost._embedded?.["wp:term"]?.[0]?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      link: isMain ? wpLinkToRoute("category", cat.link) : cat.link
    })) || [{
      id: 1,
      name: "Keine Kategorie",
      slug: "uncategorized",
      link: isMain ? "/kategorie/uncategorized" : new URL(endpoint).origin
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
      link: isMain ? `/artikel/${wpPost.slug}` : wpPost.link,
      isExternal: !isMain,
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
        sourceUrl: featuredMediaData.source_url,
        width: featuredMediaData.media_details?.width,
        height: featuredMediaData.media_details?.height,
        sizes: {
          medium: getSizeData("medium"),
          thumbnail: getSizeData("thumbnail"),
          medium_large: getSizeData("medium_large"),
          full: getSizeData("full")
        }
      } : undefined
    }
  }))


  return { posts, pagination: paginationInfo }
}

export default getPosts
