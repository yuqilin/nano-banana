import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  useEffect(() => {
    // Check for existing session on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('nanobanana_token');
      if (token) {
        // Validate token with backend
        // const user = await validateToken(token);
        // setUser(user);
        
        // For now, mock user data
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@nanobanana.ai',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          subscription: {
            plan: 'free',
            credits: 10,
            maxCredits: 10
          }
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('nanobanana_token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      // Mock sign in - in real app would call API
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        subscription: {
          plan: 'free',
          credits: 10,
          maxCredits: 10
        }
      };
      
      localStorage.setItem('nanobanana_token', 'mock-jwt-token');
      setUser(mockUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name, email, password) => {
    try {
      setLoading(true);
      // Mock sign up - in real app would call API
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        subscription: {
          plan: 'free',
          credits: 10,
          maxCredits: 10
        }
      };
      
      localStorage.setItem('nanobanana_token', 'mock-jwt-token');
      setUser(mockUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Mock Google sign in
      const mockUser = {
        id: 'google-1',
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=32&h=32&fit=crop&crop=face',
        provider: 'google',
        subscription: {
          plan: 'free',
          credits: 10,
          maxCredits: 10
        }
      };
      
      localStorage.setItem('nanobanana_token', 'mock-google-token');
      setUser(mockUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      // Mock Apple sign in
      const mockUser = {
        id: 'apple-1',
        name: 'Apple User',
        email: 'user@privaterelay.appleid.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
        provider: 'apple',
        subscription: {
          plan: 'free',
          credits: 10,
          maxCredits: 10
        }
      };
      
      localStorage.setItem('nanobanana_token', 'mock-apple-token');
      setUser(mockUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('nanobanana_token');
    setUser(null);
  };

  const openSignInModal = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const updateUserCredits = (newCredits) => {
    if (user) {
      setUser(prev => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          credits: newCredits
        }
      }));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      isAuthModalOpen,
      authMode,
      signIn,
      signUp,
      signInWithGoogle,
      signInWithApple,
      signOut,
      openSignInModal,
      openSignUpModal,
      closeAuthModal,
      updateUserCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
};