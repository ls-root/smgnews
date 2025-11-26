export type WpComments = {
  id: number,
  post: number,
  content: {
    rendered: string
  },
  date_gmt: string,
  author_name: string
}
