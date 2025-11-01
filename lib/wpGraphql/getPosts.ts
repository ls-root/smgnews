import { request, gql } from "graphql-request"

import QueryData from "@/types/graphql/QueryData";
import Post from "@/types/Post";

async function getPosts(first: number = 10, after: string = "") {
  const POSTS_QUERY = gql`
    query GetPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            excerpt
            content
            featuredImage {
      	      node {
                mediaDetails {
                  width
                  height
                }
                altText
                sourceUrl
              }
            }
          }
        }
      }
    }
  `
  if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
    throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined');
  }

  const data = await request<QueryData<Post>>(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, POSTS_QUERY, { first, after })
  const posts = data.posts.edges.map(edge => edge.node)
  return { posts: posts, pageInfo: data.posts.pageInfo }
}

export default getPosts
