import ArticleView from "@/components/ArticleView"

export default async function ArticlePage({
  params, searchParams
}: {
  params: Promise<{ author: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { author } = await params

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
      author={author}
    />
  )
}
