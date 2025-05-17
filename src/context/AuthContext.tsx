import React, { createContext, useState, useContext, useEffect } from 'react';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  // Verificar token na inicialização
  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }
      
      try {
        // Verificar se é um token de desenvolvimento local
        if (storedToken.startsWith('mock-login-token-')) {
          console.log('Token de desenvolvimento detectado');
          
          // Extrair ID do usuário do token
          const userId = storedToken.split('-')[3];
          
          // Configurar usuário fictício baseado no ID
          const mockUser: User = {
            id: userId,
            username: userId === '2' ? 'admin' : 'teste',
            display_name: userId === '2' ? 'Administrador' : 'Usuário Teste',
            displayName: userId === '2' ? 'Administrador' : 'Usuário Teste',
            email: userId === '2' ? 'admin@mentei.com' : 'teste@teste.com',
            photo_url: `https://i.pravatar.cc/150?img=${userId === '2' ? '2' : '1'}`,
            photoURL: `https://i.pravatar.cc/150?img=${userId === '2' ? '2' : '1'}`,
            bio: userId === '2' 
              ? 'Conta de administrador do sistema.' 
              : 'Esta é uma conta de teste pré-criada para facilitar testes de login.',
            points: userId === '2' ? 100 : 10,
            level: userId === '2' ? 5 : 1,
            is_pro: userId === '2',
            isPro: userId === '2',
            created_at: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
          
          setCurrentUser(mockUser);
          setToken(storedToken);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        
        // Verificar se o token é válido fazendo uma requisição à API
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.user);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Token inválido - limpar dados
          localStorage.removeItem('token');
          setCurrentUser(null);
          setToken(undefined);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkTokenValidity();
  }, []);

  // Função para login
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Tentativa de conexão com a API
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Falha no login');
        }
        
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        
        // Salvar dados do usuário
        setCurrentUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true);
        
        return true;
      } catch (connectionError) {
        console.warn('Erro de conexão com a API. Tentando modo fallback:', connectionError);
        
        // Mecanismo de fallback para ambiente de desenvolvimento
        if (window.location.hostname === 'localhost' && 
            ((email === 'admin@mentei.com' || email === 'teste@teste.com') && 
            password === 'teste123')) {
          console.log('Login em modo fallback ativado');
          
          // Criar usuário mockado com base no email
          const mockUserId = email === 'admin@mentei.com' ? '2' : '1';
          const mockUser: User = {
            id: mockUserId,
            username: email === 'admin@mentei.com' ? 'admin' : 'teste',
            display_name: email === 'admin@mentei.com' ? 'Administrador' : 'Usuário Teste',
            displayName: email === 'admin@mentei.com' ? 'Administrador' : 'Usuário Teste',
            email: email,
            photo_url: `https://i.pravatar.cc/150?img=${email === 'admin@mentei.com' ? '2' : '1'}`,
            photoURL: `https://i.pravatar.cc/150?img=${email === 'admin@mentei.com' ? '2' : '1'}`,
            bio: email === 'admin@mentei.com' 
              ? 'Conta de administrador do sistema.' 
              : 'Esta é uma conta de teste pré-criada para facilitar testes de login.',
            points: email === 'admin@mentei.com' ? 100 : 10,
            level: email === 'admin@mentei.com' ? 5 : 1,
            is_pro: email === 'admin@mentei.com',
            isPro: email === 'admin@mentei.com',
            created_at: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
          
          // Criar token de desenvolvimento
          const mockToken = `mock-login-token-${mockUserId}-${Date.now()}`;
          
          // Salvar no localStorage
          localStorage.setItem('token', mockToken);
          
          // Atualizar estado
          setCurrentUser(mockUser);
          setToken(mockToken);
          setIsAuthenticated(true);
          
          return true;
        }
        
        // Se não for um usuário válido para fallback, propagar o erro
        throw connectionError;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error instanceof Error ? error.message : 'Erro no login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para registro
  const register = async (data: any): Promise<boolean> => {
    const { username, displayName, email, password } = data;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          display_name: displayName, 
          email, 
          password 
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Falha no registro');
      }
      
      // Salvar token no localStorage
      localStorage.setItem('token', responseData.token);
      
      // Salvar dados do usuário
      setCurrentUser(responseData.user);
      setToken(responseData.token);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      setError(error instanceof Error ? error.message : 'Erro no registro');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setToken(undefined);
    setIsAuthenticated(false);
    // Redirecionar para a página de login após logout
    window.location.href = '/login';
  };

  const value = {
    currentUser,
    user,
    setUser,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
    error,
    token,
    authLoading: loading
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
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 