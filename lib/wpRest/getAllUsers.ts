import { User } from "@/types/User"
import getUsers from "./getUsers"

export default async function getAllUsers() {
  let page = 1
  let allUsers: User[] = []

  while (true) {
    const { users, paginationInfo } = await getUsers(page)

    for (const u of users) {
      if (!allUsers.some(existing => existing.id === u.id)) {
        allUsers.push(u)
      }
    }

    if (!paginationInfo.hasNextPage) break
    page += 1
  }

  return allUsers
}
