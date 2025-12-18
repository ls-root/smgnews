import AuthorCard from "@/components/AuthorCard"
import getAllUsers from "@/lib/wpRest/getAllUsers"
import roleToPretty from "@/utils/roleToPretty"

export default async function TeamPage() {
  const users = await getAllUsers()
  const authors = users.filter(user => user.roles.includes("author"))
  const roles = [...new Set(users.flatMap(user => user.roles))]

  return (
    <>
      <h1>Team</h1>
      {roles.map(role => {
        return role.startsWith("klasse_") && <div key={role}>
          <h1 key={role}>{roleToPretty(role)}</h1>
          <div className="flex flex-wrap">
            {authors.map(user => {
              return user.roles.includes(role) && (
                <AuthorCard
                  className="m-2"
                  key={user.id}
                  name={user.name}
                  description={user.description}
                  id={user.id}
                  pfp={user.avatarUrl}
                  variant="vertical"
                  inactive={user.roles.includes("inactive") ? true : false}
                />
              )
            })}
          </div>
        </div>
      })}
    </>
  )
}
