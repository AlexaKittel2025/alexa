import { useState, useEffect } from 'react';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';

export interface MockUser {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string;
  isPro: boolean;
  level: number;
  points: number;
}

export function useMockAuth() {
  const [mockUser, setMockUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário mock no localStorage
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setMockUser(user);
      } catch (e) {
        console.error('Erro ao carregar mock user:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Verificar credenciais mock
    if (email === 'teste@mentei.com' && password === 'teste123') {
      const user: MockUser = {
        id: 'test-user-1',
        username: 'teste',
        name: 'Usuário Teste',
        email: 'teste@mentei.com',
        image: generateRealPersonAvatar('men'),
        isPro: true,
        level: 15,
        points: 2500
      };
      
      localStorage.setItem('mockUser', JSON.stringify(user));
      setMockUser(user);
      return true;
    }
    
    if (email === 'demo@mentei.com' && password === 'Demo123!') {
      const user: MockUser = {
        id: 'test-user-2',
        username: 'demo',
        name: 'Demo User',
        email: 'demo@mentei.com',
        image: generateRealPersonAvatar('women'),
        isPro: false,
        level: 5,
        points: 500
      };
      
      localStorage.setItem('mockUser', JSON.stringify(user));
      setMockUser(user);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    setMockUser(null);
  };

  const isAuthenticated = mockUser !== null;

  return {
    mockUser,
    loading,
    isAuthenticated,
    login,
    logout
  };
}