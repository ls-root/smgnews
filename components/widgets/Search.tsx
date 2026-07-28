"use client"
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import WidgetSection from "./WidgetSection";

export default function SearchWidget({ forceEnabled = false, value }: { forceEnabled?: boolean, value?: string }) {
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
        <WidgetSection title="Suche" icon={Search} bodyClassName="p-0">
          <form onSubmit={handleSubmit} className="relative">
            <input
              className="block w-full bg-transparent p-4 pe-14 outline-none placeholder:text-blue-900/50 text-blue-950"
              onChange={e => setQuery(e.target.value)}
              placeholder="Suche..."
              value={query}
              type="search"
              name="query"
              id="search"
              required
            />
            <button type="submit" className="cursor-pointer absolute end-3 top-1/2 -translate-y-1/2 grid place-items-center size-9 rounded-full bg-blue-200/60 text-accent transition hover:bg-blue-300/70">
              <Search strokeWidth={3} />
            </button>
          </form>
        </WidgetSection>
      )}
    </>
  )
}
