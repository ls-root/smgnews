import { Category } from "./Category";
import { Post } from "./Post";
import { User } from "./User";

export type SearchResult =
  | (Post & { type: "post" })
  | (User & { type: "user" })
  | (Category & { type: "category" })
