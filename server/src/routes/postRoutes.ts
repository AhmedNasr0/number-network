import express from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        user_id,
        number,
        created_at,
        users!inner (
          username
        )
      `)
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    const { data: comments, error: commentsError } = await supabase
      .from('comments')
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
      .order('created_at', { ascending: true });

    if (commentsError) throw commentsError;

    // Build nested structure
    const postsWithComments = (posts || []).map((post: any) => {
      const postComments = (comments || []).filter((c: any) => c.post_id === post.id);
      
      return {
        id: post.id,
        user_id: post.user_id,
        number: parseFloat(post.number),
        created_at: post.created_at,
        username: post.users?.username || 'Unknown',
        comments: buildCommentTree(postComments)
      };
    });

    res.json(postsWithComments);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { number } = req.body;

    // Validation
    if (typeof number !== 'number' || isNaN(number)) {
      return res.status(400).json({ error: 'Number must be a valid number' });
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert([{ user_id: req.userId, number }])
      .select(`
        id,
        user_id,
        number,
        created_at,
        users!inner (
          username
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      id: post.id,
      user_id: post.user_id,
      number: parseFloat(post.number),
      created_at: post.created_at,
      username: (post.users as any)?.username || 'Unknown',
      comments: []
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Helper function to build comment tree
function buildCommentTree(comments: any[], parentId: string | null = null): any[] {
  return comments
    .filter((c: any) => c.parent_comment_id === parentId)
    .map((comment: any) => ({
      id: comment.id,
      user_id: comment.user_id,
      post_id: comment.post_id,
      parent_comment_id: comment.parent_comment_id,
      operator: comment.operator,
      right_operand: parseFloat(comment.right_operand),
      result: parseFloat(comment.result),
      created_at: comment.created_at,
      username: comment.users?.username || 'Unknown',
      children: buildCommentTree(comments, comment.id)
    }));
}

export default router;