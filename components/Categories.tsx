import Button from "@/components/Button"
import getPost from "@/lib/wpRest/getPost"

export default async function Categories({ slug }: { slug: string }) {
  const post = await getPost(slug)

  return (
    <>
      {post === null ? (
        <>
          <p>Fehler beim anzeigen der Kategorien</p>
        </>
      ) : (
        <>
          {post?.categories?.map(cat => (
            <Button key={cat.slug} text={cat.name} href={cat.link} />
          ))}
        </>
      )}
    </>
  )
}
