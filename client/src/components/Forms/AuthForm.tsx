import { useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

interface AuthFormProps {
  onSuccess: (user: User) => void;
  isLogin: boolean;
  setIsLogin: (val: boolean) => void;
}

interface User {
    username: string;
}

export const AuthForm = ({ onSuccess, isLogin, setIsLogin }: AuthFormProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleSubmit = async () => {
      setError('');
      setLoading(true);
  
      try {
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }
  
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onSuccess(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{ 
        background: 'white',
        borderRadius: '12px',
        width: '100%',
        
      }}>
        <h2 style={{ marginTop: 0 }}>{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && (
          <div style={{ 
            background: '#ffebee', 
            color: '#c62828', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}
  
        <div>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Username (min 3 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1em'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1em'
              }}
            />
          </div>
  
          <button
            onClick={handleSubmit}
            disabled={loading || username.length < 3 || password.length < 6}
            style={{
              width: '100%',
              padding: '12px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1em',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || username.length < 3 || password.length < 6 ? 0.6 : 1
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </div>
  
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={() => {
              setError('');
              setIsLogin(!isLogin);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    );
  };