import { getApiUrl } from '../../config';

/**
 * Função para atualizar o perfil do usuário
 * @param userId ID do usuário
 * @param userData Dados do usuário a serem atualizados
 * @param token Token de autenticação
 * @returns Usuário atualizado
 */
export async function updateUserProfile(userId: string, userData: any, token: string) {
  try {
    console.log('Enviando atualização do perfil para a API:', userData);
    
    // Fazer a requisição para a API real
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta da API:', response.status, errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: `Erro ${response.status}: ${response.statusText}` };
      }
      throw new Error(errorData.error || 'Erro ao atualizar perfil');
    }

    const updatedUser = await response.json();
    console.log('Resposta da API após atualização:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Erro ao processar atualização de perfil:', error);
    throw error;
  }
} 