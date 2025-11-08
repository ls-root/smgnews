import { wpUser } from "@/types/wpRest/WpUser";
import { User } from "@/types/User";

async function getUsers(search?: string) {
  if (!process.env.NEXT_PUBLIC_WP_REST_ENDPOINT) {
    throw new Error("NEXT_PUBLIC_WP_REST_ENDPOINT is not defined");
  }

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_WP_REST_ENDPOINT}/users/?search=${search || ""}`
  )

  if (!userResponse.ok) {
    throw new Error(`Failed to fetch users: ${userResponse.status} ${userResponse.statusText}`)
  }

  const wpUsers: wpUser[] = await userResponse.json()

  const users: User[] = wpUsers.map(wpUser => {
    return {
      id: wpUser.id,
      name: wpUser.name,
      url: wpUser.url,
      description: wpUser.description,
      slug: wpUser.slug,
      avatarUrl: wpUser.avatar_urls[96]
    }
  })

  return users
}

export default getUsers
