'use client';

import { createContext, useContext, PropsWithChildren } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  username: string;
  display_name: string;
  email: string;
  photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string, display_name: string, email: string, password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: PropsWithChildren) {
  // Usar a sessão do NextAuth diretamente
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  
  // Converter a sessão do NextAuth para nosso formato de usuário
  const user = session?.user ? {
    id: session.user.id as string,
    username: session.user.username as string || '',
    display_name: session.user.name || '',
    email: session.user.email || '',
    photo_url: session.user.image || undefined,
  } : null;

  // Usando Next-Auth para login
  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  };

  // Cadastro via API e login automático após cadastro
  const register = async (data: { username: string, display_name: string, email: string, password: string }) => {
    try {
      const res = await fetch('/api/users/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const responseData = await res.json();
      
      if (!responseData.success) {
        throw new Error(responseData.error);
      }
      
      // Fazer login automático após o registro bem-sucedido
      await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      throw error;
    }
  };

  // Logout via NextAuth
  const logout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 