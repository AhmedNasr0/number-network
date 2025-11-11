import type { Comment } from "./Comment";

export interface Post {
    id: string;
    username: string;
    number: number;
    created_at: string;
    comments: Comment[];
  }