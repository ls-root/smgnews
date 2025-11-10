import AuthorCard from "@/components/AuthorCard"
import getUsers from "@/lib/wpRest/getUsers"

export default async function TeamPage() {
  const users = await getUsers()

  // TODO: User groups (e.g. admin, author, etc.)
  return (
    <>
      <h1>Team</h1>
      <div className="flex flex-wrap">
        {users.map(user => (
          <AuthorCard
            className="m-2"
            key={user.id}
            name={user.name}
            description={user.description}
            id={user.id}
            pfp={user.avatarUrl}
            variant="vertical"
          />
        ))}
      </div>
    </>
  )
}
