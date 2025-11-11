import { useState } from "react";
import type { Post } from "../interfaces/Post";
import { CommentForm } from "./CommentForm";
import { CommentNode } from "./CommentNode";

interface PostCardProps{
    post: Post;
    onRefresh: () => void;
    isAuthenticated: boolean;
}

export const PostCard = ({ post, onRefresh, isAuthenticated }: PostCardProps) => {
    const [showCommentForm, setShowCommentForm] = useState(false);
  
    const handleAddComment = () => {
      onRefresh();
      setShowCommentForm(false);
    };
  
    return (
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '0.9em', opacity: 0.9, marginBottom: '8px' }}>
            <strong>{post.username}</strong> • {new Date(post.created_at).toLocaleString()}
          </div>
          <div style={{ fontSize: '3em', fontWeight: 'bold' }}>
            {post.number}
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              style={{
                marginTop: '12px',
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {showCommentForm ? 'Cancel' : '➕ Add Operation'}
            </button>
          )}
        </div>
  
        {showCommentForm && (
          <CommentForm
            postId={post.id}
            parentCommentId={''}
            leftOperand={post.number}
            onSubmit={handleAddComment}
            onCancel={() => setShowCommentForm(false)}
          />
        )}
  
        <div>
          {post.comments.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              No operations yet. Be the first to add one!
            </div>
          ) : (
            post.comments.map(comment => (
              <CommentNode
                key={comment.id as string}
                comment={comment}
                postId={post.id}
                onAddReply={onRefresh}
                isAuthenticated={isAuthenticated}
              />
            ))
          )}
        </div>
      </div>
    );
  };