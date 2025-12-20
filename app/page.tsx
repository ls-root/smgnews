import ArticleView from "@/components/ArticleView"
import SetHeader from "@/components/SetHeader"
import PollWidget from "@/components/widgets/Poll"
import SplitLayout from "@/layouts/Split"
import { getRandomPoll } from "@/lib/drizzle/getRandomPoll"

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pageParam = params.page
  const pageStr = typeof pageParam === "string"
    ? pageParam
    : Array.isArray(pageParam)
      ? pageParam[0]
      : undefined
  const page = pageStr ? parseInt(pageStr, 10) : undefined
  const validPage = page && !isNaN(page) ? page : 1

  const poll = await getRandomPoll() // needs to be fetched in a server component

  return (
    <>
      <SetHeader /> {/* Defualt */}
      <ArticleView
        page={validPage}
      />
    </>
  )
}
