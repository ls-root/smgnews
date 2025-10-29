import Edge from "@/types/graphql/Edge";

export default interface Connection<T> {
  edges: Edge<T>[]
}
