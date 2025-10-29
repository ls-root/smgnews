import { request, gql } from "graphql-request"

import QueryData from "@/types/graphql/QueryData";
import Post from "@/types/Post";

async function getPosts(first: number = 10) {
  const POSTS_QUERY = gql`
    query GetPosts($first: Int!) {
      posts(first: $first) {
        edges {
          node {
            id
            title
            excerpt
            content
          }
        }
      }
    }
  `
  if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
    throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined');
  }

  const data = await request<QueryData<Post>>(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, POSTS_QUERY, { first })
  const posts = data.posts.edges.map(edge => edge.node)
  return posts
}

export default getPosts
