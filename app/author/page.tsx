// "/author" should be only used with a slug, so redirecting to fictional route "/team" makes most sense because it also shows articles
// TODO: /team route
import { redirect } from "next/navigation";

export default function ArtikelPage() {
  redirect("/team")
}
