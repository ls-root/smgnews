import AuthorCard from "@/components/cards/AuthorCard"
import ArticleCard from "@/components/cards/ArticleCard"
import CategoryCard from "@/components/cards/CategoryCard"
import SetHeader from "@/components/SetHeader"
import SearchWidget from "@/components/widgets/Search"
import globalSearch from "@/lib/wpRest/globalSearch"

export default async function Search({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const queryParam = params.query
  const queryStr = typeof queryParam === "string"
    ? queryParam
    : Array.isArray(queryParam)
      ? queryParam[0]
      : undefined
  const query = queryStr ? queryStr : undefined
  const validQuery = query && typeof query === "string" ? query : undefined

  const results = validQuery ? await globalSearch(validQuery) : []

  return (
    <>
      {validQuery === undefined ? (
        <>
          <SearchWidget forceEnabled />
          <SetHeader title="Suche" subtitle=" " />
        </>
      ) : (
        <>
          <SetHeader title="Suche" subtitle={`Alle Inhalte gefiltert nach „${validQuery}”`} />
          <div className="space-y-4">
            <SearchWidget forceEnabled value={validQuery} />
            {results.length === 0 ? (
              <p>Keine Ergebnisse gefunden.</p>
            ) : (
              results.map((result) => {
                if (result.type === "post") {
                  return <ArticleCard post={result} key={result.slug} />
                }
                if (result.type === "user") {
                  return <AuthorCard
                    name={result.name}
                    description={result.description}
                    id={result.id}
                    pfp={result.avatarUrl}
                    variant="horizontal"
                    inactive={result.roles.includes("inactive")}
                    className="w-full"
                    key={result.slug}
                  />
                }
                if (result.type === "category") {
                  return <CategoryCard
                    category={result}
                    key={result.slug}
                  />
                }
              })
            )}
          </div>
        </>
      )}
    </>
  )
}
