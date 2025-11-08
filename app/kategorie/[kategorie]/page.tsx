import ArticleView from "@/components/ArticleView"
import getCategories from "@/lib/wpRest/getCategories"

export default async function KategoriePage({
  params, searchParams
}: {
  params: Promise<{ kategorie: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { kategorie } = await params

  const category = await getCategories(kategorie)
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
    <ArticleView
      page={validPage}
      category={categoryId}
    />
  )
}
