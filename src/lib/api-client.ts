/**
 * API Client
 * 
 * Este arquivo contém as funções para fazer chamadas à API do servidor.
 * Deve ser usado no lugar de chamar o Prisma diretamente no navegador.
 */

import { ExtendedPost, ExtendedUser } from '@/types/prisma';

// URL base para chamadas de API
const API_BASE_URL = '/api';

// Função auxiliar para fazer chamadas para a API
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
}

// API Posts
export const postsApi = {
  // Buscar posts com paginação via cursor
  getPosts: async (limit = 10, cursor?: string): Promise<ExtendedPost[]> => {
    let url = `/posts?limit=${limit}`;
    if (cursor) url += `&cursor=${cursor}`;
    return apiCall<ExtendedPost[]>(url);
  },

  // Buscar posts por tag
  getPostsByTag: async (tag: string, limit = 10, cursor?: string): Promise<ExtendedPost[]> => {
    let url = `/posts?tag=${tag}&limit=${limit}`;
    if (cursor) url += `&cursor=${cursor}`;
    return apiCall<ExtendedPost[]>(url);
  },

  // Buscar posts por usuário
  getPostsByUser: async (userId: string, limit = 10, cursor?: string): Promise<ExtendedPost[]> => {
    let url = `/posts?userId=${userId}&limit=${limit}`;
    if (cursor) url += `&cursor=${cursor}`;
    return apiCall<ExtendedPost[]>(url);
  },

  // Criar novo post
  createPost: async (postData: any): Promise<ExtendedPost> => {
    return apiCall<ExtendedPost>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // Obter post por ID
  getPostById: async (postId: string): Promise<ExtendedPost> => {
    return apiCall<ExtendedPost>(`/posts/${postId}`);
  },
};

// API Usuários
export const usersApi = {
  // Obter usuário por ID
  getUserById: async (userId: string): Promise<ExtendedUser> => {
    return apiCall<ExtendedUser>(`/users/${userId}`);
  },

  // Obter os usuários mais pontuados
  getTopUsers: async (limit = 10): Promise<ExtendedUser[]> => {
    return apiCall<ExtendedUser[]>(`/users/top?limit=${limit}`);
  },

  // Atualizar pontos de um usuário
  updateUserPoints: async (userId: string, points: number): Promise<ExtendedUser> => {
    return apiCall<ExtendedUser>(`/users/${userId}/points`, {
      method: 'PUT',
      body: JSON.stringify({ points }),
    });
  },
};

// API Tags
export const tagsApi = {
  // Obter tags populares
  getPopularTags: async (limit = 20): Promise<{id: string, name: string, count: number}[]> => {
    return apiCall<{id: string, name: string, count: number}[]>(`/tags/popular?limit=${limit}`);
  },
};

// API de inicialização
export const initApi = {
  // Inicializar o banco de dados com dados de teste
  initialize: async (): Promise<any> => {
    return apiCall<any>('/inicializar');
  },
}; 