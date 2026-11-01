import { Category } from "@/types/Category";
import { WpCategory } from "@/types/wpRest/WpCategory";
import { getMainEndpoint } from "./getWpEndpoints";

/**
 * get all categories on WP instance
 * @param {string} search - filter category list
 */
async function getCategories(search?: string) {
  const endpoint = getMainEndpoint();

  const categoriesResponse = await fetch(
    `${endpoint}/categories/?search=${search || ""}`
  )

  if (!categoriesResponse.ok) {
    throw new Error(`Failed to fetch categories: ${categoriesResponse.status} ${categoriesResponse.statusText}`)
  }

  const wpCategories: WpCategory[] = await categoriesResponse.json()

  const categories: Category[] = wpCategories.map(wpCategories => {
    return {
      id: wpCategories.id,
      name: wpCategories.name,
      slug: wpCategories.slug,
      count: wpCategories.count,
      link: wpCategories.link
    }
  })

  return categories
}

export default getCategories
