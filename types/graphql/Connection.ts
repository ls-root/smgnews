import Edge from "@/types/graphql/Edge";

export default interface Connection<T> {
  pageInfo?: {
    hasNextPage: boolean
    endCursor: string
  }
  edges: Edge<T>[]
}
