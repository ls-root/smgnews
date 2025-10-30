export default interface Post {
  id: string,
  title: string,
  excerpt: string,
  content: string,
  featuredImage: null | {
    node: {
      altText: string,
      sourceUrl: string
      mediaDetails: {
        width: number
        height: number
      }
    }
  }
}
