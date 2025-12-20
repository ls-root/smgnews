import Button from "@/components/Button"
import getPosts from "@/lib/wpRest/getPosts"

export default async function Categories({ slug }: { slug: string }) {
  const post = await getPosts(1, 1, { slug: slug })

  return (
    <>
      {post === null ? (
        <>
          <p>Fehler beim anzeigen der Kategorien</p>
        </>
      ) : (
        <div className="flex">
          {post.posts?.[0].categories?.map(cat => (
            <Button
              key={cat.slug}
              href={cat.link}
            >{cat.name}</Button>
          ))}
        </div>
      )}
    </>
  )
}
