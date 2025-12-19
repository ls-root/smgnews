import Image from "next/image"
import Button from "./Button"
import { cn } from "@/lib/cn"

export default async function AuthorCard({
  name, description, id, pfp, variant, className, inactive
}: {
  name: string, description: string, id: number, pfp: string, variant: "horizontal" | "vertical", className?: string, inactive: boolean
}) {
  return (
    <div className={cn(
      "border border-black w-fit p-2",
      variant == "horizontal" ? "flex" : "",
      className
    )}>
      <Image
        src={pfp}
        width={96}
        height={96}
        alt={"Profilbild von " + name}
        className={cn("mr-2", inactive && "grayscale")}
      />
      <div className="flex flex-col">
        <div className="flex">
          <h3>{name}</h3>
          {inactive && (
            <div className="border ml-2">Inakitv</div>
          )}
        </div>
        <p>{description}</p>
        <Button
          href={"/author/" + id}
        >{"Mehr von " + name}</Button>
      </div>
    </div>
  )
}
