import { Category } from "@/types/Category";
import { WpCategory } from "@/types/wpRest/WpCategory";

async function getCategories(search?: string) {
  if (!process.env.NEXT_PUBLIC_WP_REST_ENDPOINT) {
    throw new Error("NEXT_PUBLIC_WP_REST_ENDPOINT is not defined");
  }

  const categoriesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_WP_REST_ENDPOINT}/categories/?search=${search || ""}`
  )

  if (!categoriesResponse.ok) {
    throw new Error(`Failed to fetch users: ${categoriesResponse.status} ${categoriesResponse.statusText}`)
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
