import Connection from "@/types/graphql/Connection";

export default interface QueryData<T> {
  [key: string]: Connection<T>
}
