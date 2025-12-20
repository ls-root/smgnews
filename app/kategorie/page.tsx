import SetHeader from "@/components/SetHeader"
import getCategories from "@/lib/wpRest/getCategories"
import wpLinkToRoute from "@/utils/wpLinkToRoute"
import Link from "next/link"

export default async function KategoriePage() {
  const categories = await getCategories()

  return (
    <>
      <h1>Alle Kategorien</h1>
      <SetHeader title="Kategorien" subtitle="Hier findest du alle Kategorien" />
      {categories.map(category => (
        <Link
          key={category.link}
          href={wpLinkToRoute("category", category.link)}
          className="border border-black"
        > {"#" + category.name + "(" + category.slug + ")"} </Link>
      ))}
    </>
  )
}
