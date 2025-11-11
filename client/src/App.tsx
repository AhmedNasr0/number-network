import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { Post } from './interfaces/Post';
import type { User } from './interfaces/User';
import { NewPostForm } from './components/Forms/NewPostForm';
import { PostCard } from './components/PostCard';

const API_URL = import.meta.env.VITE_BACKEND_URL;









export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    fetchPosts();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <Header user={user as User} onLogout={handleLogout} onAuthSuccess={setUser} />

        {user && <NewPostForm onPostCreated={fetchPosts} />}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
            <h3>No posts yet</h3>
            <p>Be the first to create a starting number!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onRefresh={fetchPosts}
              isAuthenticated={!!user}
            />
          ))
        )}
      </div>
    </div>
  );
}
