import { wpUser } from "@/types/wpRest/WpUser";
import { User } from "@/types/User";
import { PaginationInfo } from "@/types/PaginationInfo";

/**
 * get users on WP instance
 * @param {string} search - filter user list
 * @param {page} page - pagination page
 */
async function getUsers(page: number, search?: string) {
  if (!process.env.NEXT_PUBLIC_WP_REST_ENDPOINT) {
    throw new Error("NEXT_PUBLIC_WP_REST_ENDPOINT is not defined");
  }

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_WP_REST_ENDPOINT}/users/?search=${search || ""}&page=${page}&context=edit`, {
    headers: {
      Authorization: "Basic " + Buffer.from(process.env.WP_COMMENTS_USERNAME + ":" + process.env.WP_COMMENTS_APPLICATION_PASSWORD).toString("base64"),
    }
  }
  )

  if (!userResponse.ok) {
    throw new Error(`Failed to fetch users: ${userResponse.status} ${userResponse.statusText}`)
  }

  const wpUsers: wpUser[] = await userResponse.json()

  const totalPages = parseInt(userResponse.headers.get("x-wp-totalpages") || "0")

  const paginationInfo: PaginationInfo = {
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }

  const users: User[] = wpUsers.map(wpUser => {
    return {
      id: wpUser.id,
      name: wpUser.name,
      url: wpUser.url,
      description: wpUser.description,
      slug: wpUser.slug,
      avatarUrl: wpUser.avatar_urls[96],
      roles: wpUser.roles
    }
  })

  return { users, paginationInfo }
}

export default getUsers
