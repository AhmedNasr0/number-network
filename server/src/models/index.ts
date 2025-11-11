import { Post } from "./Post";
import { Comment } from "./Comment";

export interface CommentWithUser extends Comment {
    username: string;
    children: CommentWithUser[];
  }
  
  export interface PostWithComments extends Post {
    username: string;
    comments: CommentWithUser[];
  }