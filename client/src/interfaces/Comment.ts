export interface Comment {
    id: string;
    username: string;
    operator: string;
    right_operand: number;
    result: number;
    created_at: string;
    children: Comment[];
  }