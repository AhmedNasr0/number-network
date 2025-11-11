import { useState } from "react";
import type { Comment } from "../interfaces/Comment";
import { CommentForm } from "./CommentForm";

interface CommentNodeProps {
    comment: Comment;
    postId: string;
    onAddReply: (comment: Comment) => void;
    isAuthenticated: boolean;
}

export const CommentNode = ({ comment, postId, onAddReply, isAuthenticated }: CommentNodeProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
  
    return (
      <div style={{ marginLeft: '30px', borderLeft: '2px solid #e0e0e0', paddingLeft: '15px', marginTop: '10px' }}>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '12px', 
          borderRadius: '8px',
          marginBottom: '8px'
        }}>
          <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '5px' }}>
            <strong>{comment.username}</strong> • {new Date(comment.created_at).toLocaleString()}
          </div>
          <div style={{ fontSize: '1.1em', fontWeight: '500' }}>
            {comment.operator} {comment.right_operand} = <span style={{ color: '#2196F3' }}>{comment.result}</span>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              style={{
                marginTop: '8px',
                padding: '4px 12px',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85em'
              }}
            >
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          )}
        </div>
  
        {showReplyForm && (
          <CommentForm
            postId={postId}
            parentCommentId={comment.id}
            leftOperand={comment.result}
            onSubmit={(newComment) => {
              onAddReply(newComment);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        )}
  
        {comment.children.map(child => (
          <CommentNode
            key={child.id}
            comment={child}
            postId={postId}
            onAddReply={onAddReply}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    );
  };