import { Category } from "@/types/Category";
import Button from "../Button";
import wpLinkToRoute from "@/utils/wpLinkToRoute";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="rounded-3xl w-full glass p-4 flex justify-between">
      <h1>{category.name}</h1>
      <Button href={wpLinkToRoute("category", category.link)}>Alle Beiträge mit „{category.name}”</Button>
    </div>
  )
}
