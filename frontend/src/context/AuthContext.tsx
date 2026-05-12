import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

export interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  birthdate: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchApi('/api/users/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If token is invalid or expired
          localStorage.removeItem('jwt_token');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
