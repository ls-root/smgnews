import { WpMedia } from "./WpMedia";

export type WpPost = {
  id: number,
  title: {
    rendered: string
  },
  excerpt: {
    rendered: string
  },
  content: {
    rendered: string
  },
  slug: string,
  featured_media: number,
  _embedded: {
    author: {
      id: number,
      name: string,
      description: string,
      avatar_urls: {
        "96": string
      }
    }[]
    "wp:featuredmedia"?: WpMedia[],
    "wp:term"?: [
      {
        id: number,
        link: string,
        name: string,
        slug: string,
      }[]
    ]
  }
}
