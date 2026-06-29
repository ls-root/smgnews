import ArticleView from "@/components/ArticleView"
import SetHeader from "@/components/SetHeader"
import getUsers from "@/lib/wpRest/getUsers"

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

  const { users } = await getUsers(1, author)
  const authorName = users.length > 0 ? users[0].name : author

  return (
    <>
      <SetHeader title={authorName} subtitle={`Alle Beiträge von ${authorName}`} />
      <ArticleView
        page={validPage}
        author={author}
      />
    </>
  )
}
