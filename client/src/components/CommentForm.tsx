import { useState } from "react";
import type { Comment } from "../interfaces/Comment";

interface CommentFormProps {
    postId: string;
    parentCommentId: string;
    leftOperand: number;
    onSubmit: (comment: Comment) => void;
    onCancel: () => void;
}

export const CommentForm = ({ postId, parentCommentId, leftOperand, onSubmit, onCancel }: CommentFormProps) => {
    const [operator, setOperator] = useState('+');
    const [rightOperand, setRightOperand] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const calculatePreview = () => {
      const num = parseFloat(rightOperand);
      if (isNaN(num)) return '...';
      
      switch (operator) {
        case '+': return leftOperand + num;
        case '-': return leftOperand - num;
        case '*': return leftOperand * num;
        case '/': return num === 0 ? 'Error: Division by zero' : leftOperand / num;
        default: return '...';
      }
    };
  
    const handleSubmit = async () => {
      setError('');
      
      const num = parseFloat(rightOperand);
      if (isNaN(num)) {
        setError('Please enter a valid number');
        return;
      }
  
      if (operator === '/' && num === 0) {
        setError('Cannot divide by zero');
        return;
      }
  
      setLoading(true);
  
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL as string}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            postId,
            parentCommentId,
            operator,
            rightOperand: num
          })
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to add comment');
        }
  
        const newComment = await response.json();
        onSubmit(newComment);
        setRightOperand('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{ 
        background: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '10px'
      }}>
        {error && (
          <div style={{ color: '#d32f2f', marginBottom: '10px', fontSize: '0.9em' }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            value={operator} 
            onChange={(e) => setOperator(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="+">+ Add</option>
            <option value="-">− Subtract</option>
            <option value="*">× Multiply</option>
            <option value="/">÷ Divide</option>
          </select>
          
          <input
            type="number"
            step="any"
            value={rightOperand}
            onChange={(e) => setRightOperand(e.target.value)}
            placeholder="Enter number"
            style={{ 
              padding: '8px', 
              flex: '1',
              minWidth: '120px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          
          <div style={{ fontSize: '1.1em', fontWeight: '500' }}>
            = {calculatePreview()}
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          
          <button 
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };