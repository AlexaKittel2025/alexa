'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { mockUsers } from '../services/mockData';
import { User } from '../types';

/**
 * Hook personalizado para gerenciar dados do usuário atual
 * Integrado com NextAuth para autenticação
 * 
 * Fornece:
 * - Dados do usuário atual
 * - Funções para atualizar o usuário
 * - Estado de carregamento
 * - Formatadores para datas e outros valores
 */
export const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário está autenticado via NextAuth
  const isAuthenticated = status === 'authenticated';
  const sessionLoading = status === 'loading';

  // Função para atualizar o usuário
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    setUser(prev => prev ? ({ ...prev, ...userData }) : null);
  };

  // Função para buscar dados do usuário
  const fetchUserData = async (username?: string) => {
    try {
      setLoading(true);
      setError(null);

      if (username) {
        // Buscar dados de um usuário específico pelo username
        const response = await fetch(`/api/users/${username}`);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário');
        }
        
        const data = await response.json();
        setUser(data.user);
      } else if (isAuthenticated && session?.user) {
        // Buscar dados completos do usuário logado
        const response = await fetch(`/api/users/${session.user.id}`);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário');
        }
        
        const data = await response.json();
        setUser(data.user);
      } else {
        // Sem usuário logado ou username fornecido
        setUser(null);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      setError('Erro ao carregar dados do perfil');
      
      // Fallback para dados de teste em desenvolvimento
      if (process.env.NODE_ENV === 'development' && session?.user?.id) {
        const fallbackUser = mockUsers.find(u => u.id === session.user.id);
        if (fallbackUser) {
          console.warn('Usando dados de usuário mock como fallback');
          setUser(fallbackUser);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Formatar data de criação
  const formatCreatedAt = (createdAt: string) => {
    return new Date(createdAt).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fornecer uma bio padrão se o usuário não tiver uma
  const defaultBio = "Este usuário ainda não adicionou uma biografia.";

  // Buscar dados do usuário quando a sessão estiver disponível
  useEffect(() => {
    if (!sessionLoading) {
      fetchUserData();
    }
  }, [isAuthenticated, sessionLoading]);

  // Construir objeto de usuário básico a partir da sessão se os dados detalhados não estiverem disponíveis
  const currentUser = user || (session?.user ? {
    id: session.user.id as string,
    username: session.user.username as string || session.user.name?.split(' ')[0].toLowerCase() || '',
    display_name: session.user.name || '',
    email: session.user.email || '',
    photo_url: session.user.image || undefined,
  } as User : null);

  return {
    user: currentUser,
    loading: loading || sessionLoading,
    error,
    isAuthenticated,
    updateUser,
    fetchUserData,
    formatCreatedAt,
    defaultBio,
    session
  };
};