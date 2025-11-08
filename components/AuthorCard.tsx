import Image from "next/image"
import Button from "./Button"

export default async function AuthorCard({
  name, description, id, pfp
}: {
  name: string, description: string, id: number, pfp: string
}) {
  return (
    <div className="border border-black">
      <Image
        src={pfp}
        width={96}
        height={96}
        alt={"Profilbild von " + name}
      />
      <h3>{name}</h3>
      <p>{description}</p>
      <Button
        text={"Mehr von " + name}
        href={"/author/" + id}
      />
    </div>
  )
}
