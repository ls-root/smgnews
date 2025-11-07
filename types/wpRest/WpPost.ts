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
    "wp:featuredmedia"?: {
      alt_text: string
      media_details: {
        sizes: {
          medium: {
            width: number,
            height: number,
            source_url: string
          },
          thumbnail: {
            width: number,
            height: number,
            source_url: string
          },
          "medium_large": {
            width: number,
            height: number,
            source_url: string
          },
          full: {
            width: number,
            height: number,
            source_url: string
          },
        }
      }
    }[],
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
