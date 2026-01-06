import ArticleView from "@/components/ArticleView"
import SetHeader from "@/components/SetHeader"
import getCategories from "@/lib/wpRest/getCategories"
import { notFound } from "next/navigation"

export default async function KategoriePage({
  params, searchParams
}: {
  params: Promise<{ kategorie: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { kategorie } = await params

  const category = await getCategories(kategorie)
  const categoryAvailable = category.length > 0
  if (!categoryAvailable) notFound()
  const categoryId = category[0].id

  const searchParamsUrl = await searchParams
  const pageParam = searchParamsUrl.page
  const pageStr = typeof pageParam === "string"
    ? pageParam
    : Array.isArray(pageParam)
      ? pageParam[0]
      : undefined
  const page = pageStr ? parseInt(pageStr, 10) : undefined
  const validPage = page && !isNaN(page) ? page : 1

  return (
    <>
      <SetHeader title={category[0].name} subtitle={`Alle Beitrage mit der Kategorie „${category[0].name}”`} />
      <ArticleView
        page={validPage}
        category={categoryId}
      />
    </>
  )
}
