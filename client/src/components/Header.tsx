import { useState } from "react";
import { Modal } from "./Modal";
import { AuthForm } from "./Forms/AuthForm";
import type { User } from "../interfaces/User";

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onAuthSuccess: (user: User) => void;
}


export const Header = ({ user, onLogout, onAuthSuccess }: HeaderProps) => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    return (
      <header style={{ 
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0 }}>Number Network</h1>
  
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Welcome, <strong>{user.username}</strong></span>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => { setIsLogin(true); setShowAuthModal(true); }}
              style={{
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setShowAuthModal(true); }}
              style={{
                padding: '8px 16px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>
        )}
  
        <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
          <AuthForm
            onSuccess={(user: User) => { 
              onAuthSuccess(user);
              setShowAuthModal(false);
            }}
            isLogin={isLogin}
            setIsLogin={(isLogin: boolean) => setIsLogin(isLogin)}
          />
        </Modal>
      </header>
    );
  };
  