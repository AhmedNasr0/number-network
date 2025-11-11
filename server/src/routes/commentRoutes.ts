import express from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { postId, parentCommentId, operator, rightOperand } = req.body;

    // Validation
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }
    if (!operator || !['+', '-', '*', '/'].includes(operator)) {
      return res.status(400).json({ error: 'Invalid operator' });
    }
    if (typeof rightOperand !== 'number' || isNaN(rightOperand)) {
      return res.status(400).json({ error: 'Right operand must be a valid number' });
    }
    if (operator === '/' && rightOperand === 0) {
      return res.status(400).json({ error: 'Cannot divide by zero' });
    }

    // Get the left operand (either from post or parent comment)
    let leftOperand: number;

    if (parentCommentId) {
      // Reply to comment - get parent comment result
      const { data: parentComment, error } = await supabase
        .from('comments')
        .select('result')
        .eq('id', parentCommentId)
        .eq('post_id', postId)
        .single();
      
      if (error || !parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
      
      leftOperand = parseFloat(parentComment.result);
    } else {
      // Comment on post - get post number
      const { data: post, error } = await supabase
        .from('posts')
        .select('number')
        .eq('id', postId)
        .single();
      
      if (error || !post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      leftOperand = parseFloat(post.number);
    }

    // Calculate result
    const result = calculate(leftOperand, operator, rightOperand);

    // Insert comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert([{
        user_id: req.userId,
        post_id: postId,
        parent_comment_id: parentCommentId || null,
        operator,
        right_operand: rightOperand,
        result
      }])
      .select(`
        id,
        user_id,
        post_id,
        parent_comment_id,
        operator,
        right_operand,
        result,
        created_at,
        users!inner (
          username
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      id: comment.id,
      user_id: comment.user_id,
      post_id: comment.post_id,
      parent_comment_id: comment.parent_comment_id,
      operator: comment.operator,
      right_operand: parseFloat(comment.right_operand),
      result: parseFloat(comment.result),
      created_at: comment.created_at,
      username: (comment.users as any)?.username || 'Unknown',
      children: []
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Helper function to calculate result
function calculate(left: number, operator: string, right: number): number {
  switch (operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return left / right;
    default: throw new Error('Invalid operator');
  }
}

export default router;
