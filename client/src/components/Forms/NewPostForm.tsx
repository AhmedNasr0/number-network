import { useState } from "react";

interface NewPostFormProps {
    onPostCreated: () => void;
}

export const NewPostForm = ({ onPostCreated }: NewPostFormProps) => {
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleSubmit = async () => {
      setError('');
  
      const num = parseFloat(number);
      if (isNaN(num)) {
        setError('Please enter a valid number');
        return;
      }
  
      setLoading(true);
  
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL as string}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ number: num })
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create post');
        }
  
        setNumber('');
        onPostCreated();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{ 
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>Create New Post</h3>
        
        {error && (
          <div style={{ color: '#d32f2f', marginBottom: '12px' }}>
            {error}
          </div>
        )}
  
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="number"
            step="any"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a starting number"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '1em'
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !number}
            style={{
              padding: '12px 24px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !number ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              opacity: loading || !number ? 0.6 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </div>
    );
  };