// "/artikel" should be only used with a slug, so redirecting to "/" makes most sense because it also shows articles
import { redirect } from "next/navigation";

export default function ArtikelPage() {
  redirect("/")
}
