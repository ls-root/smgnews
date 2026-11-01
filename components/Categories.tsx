import Button from "@/components/Button"
import getPosts from "@/lib/wpRest/getPosts"
import { Post } from "@/types/Post"

export default async function Categories({ slug, categories }: { slug?: string, categories?: Post["categories"] }) {
  const resolvedCategories = categories
    ?? (slug ? (await getPosts(1, 1, { slug: slug })).posts[0]?.categories : undefined)

  if (!resolvedCategories) {
    return (
      <p>Fehler beim anzeigen der Kategorien</p>
    )
  }

  return (
    <div className="flex">
      {resolvedCategories.map(cat => (
        <Button
          key={cat.slug}
          href={cat.link}
        >{cat.name}</Button>
      ))}
    </div>
  )
}
