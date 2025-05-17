import { User } from '../types';
import { getApiUrl } from '../config';

// Função auxiliar para obter o token de autenticação
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Busca o perfil do usuário autenticado
 * @returns Dados do perfil do usuário
 */
export const getUserProfile = async (): Promise<User> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Não autenticado');
    }
    
    console.log('Buscando perfil do usuário autenticado');
    
    const response = await fetch(`${getApiUrl()}/api/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      mode: 'cors',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao buscar perfil:', response.status, errorText);
      throw new Error('Erro ao buscar perfil do usuário');
    }
    
    const data = await response.json();
    return data.user as User;
  } catch (error) {
    console.error('Erro na requisição de perfil:', error);
    throw error;
  }
};

/**
 * Atualiza o perfil do usuário
 * @param userId ID do usuário
 * @param userData Dados a serem atualizados
 * @returns Perfil atualizado
 */
export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Não autenticado');
    }
    
    console.log('Atualizando perfil do usuário:', userData);
    
    const response = await fetch(`${getApiUrl()}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
      credentials: 'include',
      mode: 'cors',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao atualizar perfil:', response.status, errorText);
      throw new Error('Erro ao atualizar perfil do usuário');
    }
    
    const data = await response.json();
    return data.user as User;
  } catch (error) {
    console.error('Erro na requisição de atualização de perfil:', error);
    throw error;
  }
};

/**
 * Verifica o status PRO do usuário
 * @param userId ID do usuário
 * @returns Status PRO
 */
export const checkUserProStatus = async (userId: string): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Não autenticado');
    }
    
    console.log(`Verificando status PRO do usuário ${userId}`);
    
    const response = await fetch(`${getApiUrl()}/api/users/${userId}/pro-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      mode: 'cors',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao verificar status PRO:', response.status, errorText);
      return false;
    }
    
    const data = await response.json();
    return data.isPro;
  } catch (error) {
    console.error('Erro na requisição de status PRO:', error);
    return false;
  }
}; 