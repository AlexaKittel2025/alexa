import { User, Post, Comment, Storyment, ReactionType, JudgementType } from '../types';
import { appConfig, getApiUrl } from '../config';

// URL base da API - agora usando função para permitir alteração em tempo de execução

// Função para obter o token de autenticação do armazenamento local
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Função para fazer requisições à API
export const fetchApi = async <T>(
  endpoint: string, 
  method: string = 'GET', 
  body?: any, 
  requiresAuth: boolean = true
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  // Adicionar token de autenticação se necessário
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Não autenticado');
    }
  }
  
  // Configuração da requisição
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // Incluir cookies na requisição
    mode: 'cors', // Habilitar CORS
  };
  
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }
  
  let apiEndpoint = endpoint;
    
  // Garantir que o endpoint comece com /api
  if (!apiEndpoint.startsWith('/api')) {
    apiEndpoint = `/api${apiEndpoint}`;
  }
  
  // Corrigir URLs específicas que estão com problema
  if (apiEndpoint.includes('/api/users/') && apiEndpoint.includes('/pro-status')) {
    const userId = apiEndpoint.split('/api/users/')[1].split('/pro-status')[0];
    apiEndpoint = `/api/users/${userId}/pro-status`;
  }
  
  const url = `${getApiUrl()}${apiEndpoint}`;
  
  const response = await fetch(url, config);
  
  // Log do status da resposta

  // Verificar headers da resposta
  const contentType = response.headers.get('content-type');
  
  // Ler o texto da resposta antes de tentar fazer parse
  const responseText = await response.text();
  
  // Se a resposta estiver vazia, retornar objeto vazio
  if (!responseText) {
    return {} as T;
  }
  
  let responseData: any;
  try {
    responseData = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    console.error('Erro ao fazer parse do JSON:', e);
    if (response.ok) {
      // Se a resposta foi bem-sucedida, mas não pudemos analisar o JSON, retorne um objeto vazio
      return {} as T;
    }
    throw new Error('Erro no formato da resposta do servidor');
  }
  
  // Verificar se a resposta foi bem-sucedida
  if (!response.ok) {
    // Extrair mensagem de erro da resposta
    const errorMessage = responseData && responseData.error 
      ? responseData.error 
      : `Erro na requisição (${response.status})`;

    throw new Error(errorMessage);
  }
  
  // Retornar dados da resposta
  return responseData as T;
};

// Interfaces para as respostas da API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Interface para resposta de autenticação
interface UserAuthResponse {
  user: User;
  token: string;
}

// API de usuários
export const userApi = {
  // Obter usuário atual
  getCurrent: async (): Promise<User> => {
    return await fetchApi<User>('/users/me');
  },
  
  // Obter usuário pelo ID  
  getById: async (id: string): Promise<User> => {
    return await fetchApi<User>(`/users/${id}`);
  },
  
  // Obter usuário pelo nome de usuário
  getByUsername: async (username: string): Promise<User> => {
    return await fetchApi<User>(`/users/username/${username}`);
  },
  
  // Atualizar informações do usuário
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const fullUrl = `${getApiUrl()}/users/${id}`;

      // Caminho correto da API sem /update
      const response = await fetchApi<User>(`/users/${id}`, 'PUT', userData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
  
  // Seguir usuário
  follow: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/users/${id}/follow`, 'POST');
  },
  
  // Deixar de seguir usuário
  unfollow: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/users/${id}/unfollow`, 'POST');
  },
  
  // Verificar status PRO do usuário
  getProStatus: async (id: string): Promise<{ isPro: boolean }> => {
    return await fetchApi<{ isPro: boolean }>(`/users/${id}/pro-status`);
  },
  
  // Atualizar para status PRO
  upgradeToPro: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/users/${id}/upgrade-pro`, 'POST');
  }
};

// API de posts
export const postApi = {
  // Obter todos os posts
  getAll: async (limit: number = 20, offset: number = 0): Promise<Post[]> => {
    return await fetchApi<Post[]>(`/posts?limit=${limit}&offset=${offset}`);
  },
  
  // Obter post pelo ID
  getById: async (id: string): Promise<Post> => {
    return await fetchApi<Post>(`/posts/${id}`);
  },
  
  // Obter posts do usuário
  getByUserId: async (userId: string, limit: number = 20, offset: number = 0): Promise<Post[]> => {
    return await fetchApi<Post[]>(`/posts/user/${userId}?limit=${limit}&offset=${offset}`);
  },
  
  // Criar novo post
  create: async (postData: Partial<Post>): Promise<Post> => {
    return await fetchApi<Post>('/posts', 'POST', postData);
  },
  
  // Atualizar post
  update: async (id: string, postData: Partial<Post>): Promise<Post> => {
    return await fetchApi<Post>(`/posts/${id}`, 'PUT', postData);
  },
  
  // Deletar post
  delete: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/posts/${id}`, 'DELETE');
  },
  
  // Curtir post
  like: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/posts/${id}/like`, 'POST');
  },
  
  // Descurtir post
  unlike: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/posts/${id}/unlike`, 'POST');
  },
  
  // Obter posts por tag
  getByTag: async (tagName: string, limit: number = 20, offset: number = 0): Promise<Post[]> => {
    return await fetchApi<Post[]>(`/posts/tag/${tagName}?limit=${limit}&offset=${offset}`);
  },
  
  // Adicionar reação a um post
  addReaction: async (postId: string, reactionData: { userId: string, reactionType: ReactionType }): Promise<{ success: boolean, reactions: Record<string, number> }> => {
    return await fetchApi<{ success: boolean, reactions: Record<string, number> }>(`/posts/${postId}/reaction`, 'POST', reactionData);
  },
  
  // Adicionar julgamento a um post
  addJudgement: async (postId: string, judgementData: { userId: string, judgementType: JudgementType }): Promise<{ success: boolean, judgements: Record<string, number> }> => {
    return await fetchApi<{ success: boolean, judgements: Record<string, number> }>(`/posts/${postId}/judgement`, 'POST', judgementData);
  }
};

// API de comentários
export const commentApi = {
  // Obter comentários de um post
  getByPostId: async (postId: string): Promise<Comment[]> => {
    return await fetchApi<Comment[]>(`/comments/post/${postId}`);
  },
  
  // Criar novo comentário
  create: async (commentData: Partial<Comment>): Promise<Comment> => {
    return await fetchApi<Comment>('/comments', 'POST', commentData);
  },
  
  // Deletar comentário
  delete: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/comments/${id}`, 'DELETE');
  }
};

// API de storyments
export const storymentApi = {
  // Obter storyments do usuário
  getByUserId: async (userId: string): Promise<Storyment[]> => {
    return await fetchApi<Storyment[]>(`/storyments/user/${userId}`);
  },
  
  // Criar novo storyment
  create: async (storymentData: Partial<Storyment>): Promise<Storyment> => {
    return await fetchApi<Storyment>('/storyments', 'POST', storymentData);
  },
  
  // Deletar storyment
  delete: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/storyments/${id}`, 'DELETE');
  }
};

// Função específica para registro de usuários (sem autenticação)
export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  username: string;
}): Promise<ApiResponse<UserAuthResponse>> => {
  console.log('Registrando usuário:', { ...userData, password: '***' });
  console.log('URL da API:', `${getApiUrl()}/api/auth/register`);

  try {
    const response = await fetch(`${getApiUrl()}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
      mode: 'cors',
    });

    // Capturar o texto da resposta para debug
    const responseText = await response.text();
    console.log(`Resposta de login: ${responseText.slice(0, 150)}`);
    
    let data: any = {};
    
    // Tentar fazer parse do JSON se não estiver vazio
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Erro ao fazer parse da resposta:', error);
        throw new Error('Erro ao processar resposta do servidor');
      }
    }
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, data);
      throw new Error(data.error || 'Erro ao registrar usuário');
    }

    return data as ApiResponse<UserAuthResponse>;
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw error;
  }
};

// Função específica para login de usuários
export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<ApiResponse<UserAuthResponse>> => {
  console.log('Fazendo login:', { email: credentials.email });
  console.log('URL da API:', `${getApiUrl()}/api/auth/login`);
  
  try {
    const response = await fetch(`${getApiUrl()}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
      mode: 'cors',
    });

    // Capturar o texto da resposta para debug
    const responseText = await response.text();
    console.log(`Resposta de login: ${responseText.slice(0, 150)}`);
    
    let data: any = {};
    
    // Tentar fazer parse do JSON se não estiver vazio
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Erro ao fazer parse da resposta:', error);
        throw new Error('Erro ao processar resposta do servidor');
      }
    }
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, data);
      throw new Error(data.error || 'Erro ao fazer login');
    }

    // Armazenar o token se fornecido
    if (data.data && data.data.token) {
      localStorage.setItem('authToken', data.data.token);
    }

    return data as ApiResponse<UserAuthResponse>;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

// Função para obter o perfil atual do usuário com dados completos
export const getCurrentProfile = async (): Promise<User> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
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
      console.error('Erro na resposta:', response.status, errorText);
      throw new Error('Erro ao buscar perfil');
    }
    
    const data = await response.json();
    return data.user as User;
  } catch (error) {
    console.error('Erro ao buscar perfil atual:', error);
    throw error;
  }
};