import Image from "next/image"
import Button from "./Button"
import { cn } from "@/lib/cn"

export default async function AuthorCard({
  name, description, id, pfp, variant, className
}: {
  name: string, description: string, id: number, pfp: string, variant: "horizontal" | "vertical", className: string
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
        className="mr-2"
      />
      <div className="flex flex-col">
        <h3>{name}</h3>
        <p>{description}</p>
        <Button
          text={"Mehr von " + name}
          href={"/author/" + id}
        />
      </div>
    </div>
  )
}
