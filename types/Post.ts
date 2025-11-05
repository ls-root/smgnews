export type Post = {
  id: number,
  title: string,
  slug: string,
  excerpt: string,
  content: string,
  featuredMediaAvailable: boolean
  featuredMedia?: {
    alt: string,
    sizes: {
      medium?: {
        width: number,
        height: number,
        sourceUrl: string
      },
      thumbnail?: {
        width: number,
        height: number,
        sourceUrl: string
      },
      "medium_large"?: {
        width: number,
        height: number,
        sourceUrl: string
      },
      full?: {
        width: number,
        height: number,
        sourceUrl: string
      },
    }
  }
}
