import Image from "next/image"
import Button from "../Button"
import { cn } from "@/lib/cn"

export default async function AuthorCard({
  name, description, id, pfp, variant, className, inactive
}: {
  name: string, description: string, id: number, pfp: string, variant: "horizontal" | "vertical", className?: string, inactive: boolean
}) {
  return (
    <div
      key={id}
      className={cn(
        "glass rounded-3xl p-2",
        variant === "horizontal" ? "flex" : "flex flex-col",
        className
      )}>
      <Image
        src={pfp}
        width={96}
        height={96}
        alt={"Profilbild von " + name}
        className={cn(
          "mr-2 rounded-3xl object-cover",
          inactive && "grayscale",
          variant === "horizontal" ? "self-stretch aspect-square" : "mb-2 aspect-square size-30"
        )}
      />

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center">
            <h4>{name}</h4>
            {inactive && <div className="glass rounded-full px-2 ml-2">Inaktiv</div>}
          </div>
          <p>{description}</p>
        </div>

        <div className="flex justify-end self-end mt-2">
          <Button href={"/author/" + id}>{"Mehr von " + name}</Button>
        </div>
      </div>
    </div>
  )
}
