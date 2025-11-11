
  
  export interface Comment {
    id: string;
    user_id: string;
    post_id: string;
    parent_comment_id: string | null;
    operator: '+' | '-' | '*' | '/';
    right_operand: number;
    result: number;
    created_at: Date;
  }