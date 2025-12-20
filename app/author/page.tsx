// "/author" should be only used with a slug, so redirecting "/team" makes most sense
import { redirect } from "next/navigation";

export default function ArtikelPage() {
  redirect("/team")
}
