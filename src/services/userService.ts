import { userApi, postApi, commentApi, storymentApi } from './api';
import { User } from '../types';
import { mockUsers } from './mockData';

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Obter o token de autenticação
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Obter o usuário atual do localStorage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    
    return null;
  }
};

// Login de usuário
export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Simulando uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Encontrar o usuário nos mockados
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Em um ambiente real, verificaríamos a senha com hash
    // Para o mock, assumimos que a senha é válida
    
    // Gerar um token fictício
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    // Salvar no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    
    throw error;
  }
};

// Registro de usuário
export const register = async (userData: Partial<User>): Promise<User> => {
  try {
    // Simulando uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Verificar se usuário ou email já existe
    const userExists = mockUsers.some(
      u => u.email === userData.email || u.username === userData.username
    );
    
    if (userExists) {
      throw new Error('Usuário ou email já existe');
    }
    
    // Criar novo usuário
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username || '',
      displayName: userData.displayName || userData.username || '',
      email: userData.email || '',
      photoURL: userData.photoURL || 'https://via.placeholder.com/150',
      bio: userData.bio || '',
      points: 0,
      level: 1,
      isPro: false,
      createdAt: new Date().toISOString(),
      followers: 0,
      following: 0,
      achievements: []
    };
    
    // Adicionar à lista de usuários mock
    mockUsers.push(newUser);
    
    // Gerar um token fictício
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    
    // Salvar no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return newUser;
  } catch (error) {
    
    throw error;
  }
};

// Logout de usuário
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Verificar se o usuário atual é PRO
export const getCurrentUserProStatus = async (userId: string): Promise<boolean> => {
  try {
    const currentUser = getCurrentUser();
    
    // Se temos o usuário no localStorage e o ID corresponde, use isso
    if (currentUser && currentUser.id === userId) {
      return currentUser.isPro;
    }
    
    // Caso contrário, busque da API
    const result = await api.user.getProStatus(userId);
    return result.isPro;
  } catch (error) {
    
    return false;
  }
};

// Atualizar informações do usuário
export const updateUserInfo = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const updatedUser = await api.user.update(userId, userData);
    
    // Atualizar no localStorage se for o usuário atual
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...updatedUser
      }));
    }
    
    return updatedUser;
  } catch (error) {
    
    throw error;
  }
};

// Fazer upgrade para PRO
export const upgradeToPro = async (userId: string): Promise<User> => {
  try {
    const result = await userApi.upgradeToPro(userId);
    
    // Atualizar no localStorage se for o usuário atual
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        isPro: true
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    // Se não for o usuário atual, busque as informações atualizadas
    return await userApi.getById(userId);
  } catch (error) {
    
    throw error;
  }
};

// Gerar uma mentira aleatória (recurso PRO)
export const generateRandomLie = async (userId: string, customTopic?: string): Promise<string> => {
  try {
    // Se houver um tópico personalizado, envie-o para a API
    let response;
    if (customTopic) {
      // TODO: Implement generator API
      response = { lie: 'Mentira gerada' };
    } else {
      // TODO: Implement generator API
      response = { lie: 'Mentira gerada' };
    }
    return response.lie;
  } catch (error) {
    
    throw error;
  }
};

// Função para seguir/deixar de seguir um usuário
export const toggleFollowUser = async (currentUserId: string, targetUserId: string): Promise<{ success: boolean, isFollowing: boolean }> => {
  try {
    // Simulando atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Buscar o usuário que está sendo seguido
    const targetUser = mockUsers.find(u => u.id === targetUserId);
    if (!targetUser) {
      throw new Error('Usuário não encontrado');
    }
    
    // Buscar o usuário atual
    const currentUser = mockUsers.find(u => u.id === currentUserId);
    if (!currentUser) {
      throw new Error('Usuário atual não autenticado');
    }
    
    // Verificar se já está seguindo (simulação)
    // Em uma implementação real, você teria uma tabela de relacionamentos entre usuários
    const isCurrentlyFollowing = Math.random() < 0.5; // Simulação
    
    if (isCurrentlyFollowing) {
      // Deixar de seguir
      if (targetUser.followers && targetUser.followers > 0) {
        targetUser.followers -= 1;
      }
      
      if (currentUser.following && currentUser.following > 0) {
        currentUser.following -= 1;
      }
    } else {
      // Seguir
      targetUser.followers = (targetUser.followers || 0) + 1;
      currentUser.following = (currentUser.following || 0) + 1;
    }
    
    return {
      success: true,
      isFollowing: !isCurrentlyFollowing
    };
  } catch (error) {
    
    throw error;
  }
};

// Função para verificar se um usuário segue outro
export const checkIfFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    // Simulando atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    // Para ambiente de mock, sempre retorna false
    return false;
  } catch (error) {
    
    return false;
  }
};

// Função para obter lista de seguidores de um usuário
export const getUserFollowers = async (userId: string): Promise<User[]> => {
  try {
    // Simulando atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Em uma implementação real, você buscaria isso no banco de dados
    // Para o mock, vamos retornar uma lista aleatória de usuários
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    const followerCount = user.followers || 0;
    const followers = [];
    
    // Gerar uma lista aleatória de seguidores
    for (let i = 0; i < Math.min(followerCount, mockUsers.length); i++) {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      if (!followers.some(u => u.id === randomUser.id) && randomUser.id !== userId) {
        followers.push(randomUser);
      }
    }
    
    return followers;
  } catch (error) {
    
    return [];
  }
};

// Função para obter lista de usuários que um usuário segue
export const getUserFollowing = async (userId: string): Promise<User[]> => {
  try {
    // Simulando atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Em uma implementação real, você buscaria isso no banco de dados
    // Para o mock, vamos retornar uma lista aleatória de usuários
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    const followingCount = user.following || 0;
    const following = [];
    
    // Gerar uma lista aleatória de usuários seguidos
    for (let i = 0; i < Math.min(followingCount, mockUsers.length); i++) {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      if (!following.some(u => u.id === randomUser.id) && randomUser.id !== userId) {
        following.push(randomUser);
      }
    }
    
    return following;
  } catch (error) {
    
    return [];
  }
}; 