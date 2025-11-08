import getCategories from "@/lib/wpRest/getCategories"
import Link from "next/link"

export default async function KategoriePage() {
  const categories = await getCategories()

  return (
    <>
      <h1>Alle Kategorien</h1>
      {categories.map(category => (
        <Link
          key={category.link}
          href={category.link} // TODO: Category route
          className="border border-black"
        > {"#" + category.name} </Link>
      ))}
    </>
  )
}
