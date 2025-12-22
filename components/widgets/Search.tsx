"use client"
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchWidget({ forceEnabled = false, value }: { forceEnabled: boolean, value?: string }) {
  const [query, setQuery] = useState(value)
  const enabled = forceEnabled === true
    ? true :
    usePathname() === "/search" ? false : true
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("query")?.toString().trim()

    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`)
    }
  }
  return (
    <>
      {enabled && (
        <form onSubmit={handleSubmit}>
          <div className="relative glass rounded-3xl">
            <input
              className="block w-full p-3 outline-none"
              onChange={e => setQuery(e.target.value)}
              placeholder="Suche..."
              value={query}
              type="search"
              name="query"
              id="search"
              required
            />
            <button type="submit" className="cursor-pointer absolute end-1.5 bottom-1.5 border-transparent px-3 py-1.5 glass rounded-3xl">
              <Search color="oklch(62.3% 0.214 259.815)" strokeWidth={3} />
            </button>
          </div>
        </form>
      )}
    </>
  )
}
