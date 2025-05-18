'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token?: string;
  authLoading?: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Sincronizar estado do usuário com a sessão do NextAuth
  useEffect(() => {
    if (session?.user) {
      const userData: User = {
        id: session.user.id || '',
        username: session.user.username || '',
        display_name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || '',
      };
      setUser(userData);
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError('Erro ao fazer login');
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/users/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Erro ao registrar');
        return false;
      }

      // Após registro bem-sucedido, fazer login automaticamente
      return await login(data.email, data.password);
    } catch (err) {
      setError('Erro ao registrar');
      return false;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
  };

  const value: AuthContextType = {
    currentUser: user,
    user,
    login,
    register,
    logout,
    isAuthenticated: !!session,
    loading: status === 'loading',
    error,
    authLoading: status === 'loading',
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};