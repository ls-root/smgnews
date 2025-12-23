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
        "glass rounded-3xl w-fit p-2",
        variant === "horizontal" ? "flex w-1/2 min-h-32" : "flex flex-col",
        className
      )}>
      <Image
        src={pfp}
        width={96}
        height={96}
        alt={"Profilbild von " + name}
        className={cn(
          "mr-2 rounded-3xl aspect-square object-cover size-30",
          inactive && "grayscale",
          variant === "vertical" && "mb-2"
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
