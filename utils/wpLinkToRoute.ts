export default function wpLinkToRoute(type: "category", link: string) {
  switch (type) {
    case "category": {
      const match = link.match(/\/category\/([^\/]+)/)
      const categorySlug = match ? match[1] : null
      return "/kategorie/" + categorySlug
    }
  }
}
