import Image from "next/image"
import Button from "./Button"

export default async function AuthorCard({
  name, description, slug, pfp
}: {
  name: string, description: string, slug: string, pfp: string
}) {
  return (
    <div className="border border-black">
      <Image
        src={pfp}
        width={96}
        height={96}
        alt={"Profilbild von " + slug}
      />
      <h3>{name}</h3>
      <p>{description}</p>
      <Button
        text={"Mehr von " + name}
        href={"/author/" + slug} // fictional route
      />
    </div>
  )
}
