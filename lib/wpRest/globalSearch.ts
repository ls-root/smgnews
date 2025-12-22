import textOnly from "../textOnly";
import getCategories from "./getCategories";
import getPosts from "./getPosts";
import getUsers from "./getUsers";
import { SearchResult } from "@/types/SearchResult";

function calculateScore(
  text: string | null | undefined,
  query: string,
  exactBonus: number = 10,
  startsWithBonus: number = 5,
  containsBonus: number = 1
): number {
  if (!text) return 0
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  if (lowerText === lowerQuery) return exactBonus // exact match
  if (lowerText.startsWith(lowerQuery)) return startsWithBonus // starts with
  if (lowerText.includes(lowerQuery)) return containsBonus // contains
  return 0
}
export default async function globalSearch(search: string): Promise<SearchResult[]> {
  const posts = (await getPosts(20, 1, { search: search })).posts
  const users = (await getUsers(1, search)).users
  const categories = await getCategories(search)

  const scoredPosts = posts.map(post => {
    const excerpt = textOnly(post.excerpt) // avoid html

    const titleScore = calculateScore(post.title, search, 10, 6, 2)
    const excerptScore = calculateScore(excerpt, search, 0, 0, 1)
    const contentScore = calculateScore(post.content, search, 0, 0, 1)
    return {
      ...post,
      type: "post" as const,
      score: titleScore + excerptScore + contentScore
    }
  })

  const scoredUsers = users.map(user => ({
    ...user,
    type: "user" as const,
    score: Math.max(
      calculateScore(user.name, search, 12, 8, 3),
      calculateScore(user.slug, search, 10, 7, 2),
      calculateScore(user.description, search, 0, 0, 1)
    )
  }))

  const scoreCategoris = categories.map(category => ({
    ...category,
    type: "category" as const,
    score: Math.max(
      calculateScore(category.name, search, 11, 7, 3),
      calculateScore(category.slug, search, 9, 6, 2),
    )
  }))

  const allResults = [...scoredPosts, ...scoredUsers, ...scoreCategoris]

  // sort by score
  return allResults
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return Math.random() - 0.5
    })
    .filter(item => item.score > 0) // only return relevant matches
}
