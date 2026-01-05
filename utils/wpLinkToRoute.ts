export default function wpLinkToRoute(type: "category" | "toc", link: string) {
  switch (type) {
    case "category": {
      const match = link.match(/\/category\/([^\/]+)/)
      const categorySlug = match ? match[1] : null
      return "/kategorie/" + categorySlug
    }
    case "toc": {
      const match = link.match(/\/archive\/([^\/]+)\/(\?.*)?$/)
      const slug = match?.[1]
      const params = match?.[2]
      const paramsFixed = params?.replace(/page=(\d+)/, (_, n) => {
        return `page=${Math.max(0, Number(n) - 1)}`
      })
      return "/artikel/" + slug + paramsFixed
    }
  }
}
