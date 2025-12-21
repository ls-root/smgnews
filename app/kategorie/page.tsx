import Button from "@/components/Button"
import SetHeader from "@/components/SetHeader"
import getCategories from "@/lib/wpRest/getCategories"
import wpLinkToRoute from "@/utils/wpLinkToRoute"

export default async function KategoriePage() {
  const categories = await getCategories()

  return (
    <>
      <SetHeader title="Kategorien" subtitle="Hier findest du alle Kategorien" />
      <div className="space-y-2">
        {categories.map(category => (
          <Button
            key={category.link}
            href={wpLinkToRoute("category", category.link)}
          > {category.name} </Button>
        ))}
      </div>
    </>
  )
}
