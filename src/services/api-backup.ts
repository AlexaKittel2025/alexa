import { User, Post, Comment, Storyment } from '../types';
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
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    mode: 'cors',
  };
  
  // Realizar a requisição
  try {
    // Corrigir endpoints de usuário
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
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Obter resposta como texto para análise inicial
    const responseText = await response.text();
    :`, responseText ? responseText.substring(0, 150) + '...' : 'Vazia');
    
    // Tentar converter para JSON
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      
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
  } catch (error: any) {

    // Tratar erros comuns com mensagens mais amigáveis
    if (error.message === 'Failed to fetch') {
      
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
    }
    
    // Erros específicos para login/registro
    if (endpoint.includes('/login') || endpoint.includes('/register')) {
      // Para debug em modo mock, podemos tentar criar um objeto fake para testes
      if (process.env.NODE_ENV === 'development' && appConfig.apiUrl.includes('localhost')) {
        
        if (endpoint.includes('/login')) {
          const credentials = body as {email: string; password: string};
          if (credentials.email === 'admin@mentei.com' && credentials.password === 'teste123') {
            return {
              user: {
                id: '2',
                username: 'admin',
                displayName: 'Administrador',
                email: 'admin@mentei.com',
                photoURL: 'https://i.pravatar.cc/150?img=2',
                bio: 'Conta de administrador do sistema.',
                points: 100,
                level: 5,
                isPro: true,
              },
              token: 'mock-token-debug-123456789'
            } as unknown as T;
          } else if (credentials.email === 'teste@teste.com' && credentials.password === 'teste123') {
            return {
              user: {
                id: '1',
                username: 'teste',
                displayName: 'Usuário Teste',
                email: 'teste@teste.com',
                photoURL: 'https://i.pravatar.cc/150?img=1',
                bio: 'Esta é uma conta de teste pré-criada para facilitar testes de login.',
                points: 10,
                level: 1,
                isPro: false,
              },
              token: 'mock-token-debug-987654321'
            } as unknown as T;
          }
        }
      }
    }
    
    throw error;
  }
};

// Função para verificar se estamos em ambiente de desenvolvimento
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
};

// Tipos de dados para API
export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

export interface UserAuthResponse {
  user: User;
  token: string;
}

export interface UserRegistrationData {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export interface UserLoginCredentials {
  email: string;
  password: string;
}

// API de usuários
export const userApi = {
  // Registrar novo usuário
  async register(userData: UserRegistrationData): Promise<ApiResponse<UserAuthResponse>> {
    }/api/auth/register`);

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
          
          throw new Error('Erro ao processar resposta do servidor');
        }
      }
      
      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        
        throw new Error(data.error || 'Erro ao registrar usuário');
      }

      return data as ApiResponse<UserAuthResponse>;
    } catch (error) {
      
      throw error;
    }
  },
  
  // Login de usuário
  async login(credentials: UserLoginCredentials): Promise<ApiResponse<UserAuthResponse>> {
    }/api/auth/login`);
    
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
          
          throw new Error('Erro ao processar resposta do servidor');
        }
      }
      
      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        
        throw new Error(data.error || 'Credenciais inválidas');
      }

      return data as ApiResponse<UserAuthResponse>;
    } catch (error) {
      
      throw error;
    }
  },
  
  // Buscar perfil do usuário autenticado
  async getProfile(): Promise<User> {

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Não autenticado');
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
        
        throw new Error('Erro ao buscar perfil');
      }
      
      const data = await response.json();
      return data.user as User;
    } catch (error) {
      
      throw error;
    }
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
      
      throw error;
    }
  },
  
  // Atualizar configurações do usuário
  updateSettings: async (id: string, settings: any): Promise<User> => {
    return await fetchApi<User>(`/users/${id}/settings`, 'PUT', settings);
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
  
  // Obter posts de um usuário
  getByUserId: async (userId: string, limit: number = 20, offset: number = 0): Promise<Post[]> => {
    return await fetchApi<Post[]>(`/posts/user/${userId}?limit=${limit}&offset=${offset}`);
  },
  
  // Obter posts por tag
  getByTag: async (tagName: string, limit: number = 20, offset: number = 0): Promise<Post[]> => {
    return await fetchApi<Post[]>(`/posts/tag/${tagName}?limit=${limit}&offset=${offset}`);
  },
  
  // Criar um novo post
  create: async (postData: {
    userId: string;
    content: string;
    imageURL?: string;
    tags?: string[];
    isGenerated?: boolean;
  }): Promise<Post> => {
    return await fetchApi<Post>('/posts', 'POST', postData);
  },
  
  // Atualizar um post
  update: async (id: string, postData: Partial<Post>): Promise<Post> => {
    return await fetchApi<Post>(`/posts/${id}`, 'PUT', postData);
  },
  
  // Excluir um post
  delete: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/posts/${id}`, 'DELETE');
  },
  
  // Adicionar uma reação a um post
  addReaction: async (id: string, data: {
    userId: string;
    reactionType: string;
  }): Promise<{ success: boolean; reactions: Record<string, number> }> => {
    return await fetchApi<{ success: boolean; reactions: Record<string, number> }>(
      `/posts/${id}/reactions`,
      'POST',
      data
    );
  },
  
  // Adicionar um julgamento a um post
  addJudgement: async (id: string, data: {
    userId: string;
    judgementType: string;
  }): Promise<{ success: boolean; judgements: Record<string, number> }> => {
    return await fetchApi<{ success: boolean; judgements: Record<string, number> }>(
      `/posts/${id}/judgements`,
      'POST',
      data
    );
  }
};

// API de storyments
export const storymentApi = {
  // Obter storyments ativos
  getActiveStoryments: async (limit: number = 20, offset: number = 0): Promise<Storyment[]> => {
    return await fetchApi<Storyment[]>(`/storyments/active?limit=${limit}&offset=${offset}`);
  },
  
  // Obter storyment por ID
  getById: async (id: string): Promise<Storyment> => {
    return await fetchApi<Storyment>(`/storyments/${id}`);
  },
  
  // Obter storyments de um usuário
  getByUserId: async (userId: string, limit: number = 20, offset: number = 0, includeExpired: boolean = false): Promise<Storyment[]> => {
    return await fetchApi<Storyment[]>(
      `/storyments/user/${userId}?limit=${limit}&offset=${offset}&includeExpired=${includeExpired}`
    );
  },
  
  // Criar um novo storyment
  create: async (storymentData: {
    userId: string;
    content: string;
    backgroundColor: string;
    textColor: string;
    expiresAt?: string;
  }): Promise<Storyment> => {
    return await fetchApi<Storyment>('/storyments', 'POST', storymentData);
  },
  
  // Excluir um storyment
  delete: async (id: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(`/storyments/${id}`, 'DELETE');
  },
  
  // Marcar storyment como visualizado
  markAsViewed: async (id: string, userId: string): Promise<{ success: boolean }> => {
    return await fetchApi<{ success: boolean }>(
      `/storyments/${id}/view`,
      'POST',
      { userId }
    );
  },
  
  // Verificar se um usuário visualizou um storyment
  hasUserViewed: async (id: string, userId: string): Promise<{ hasViewed: boolean }> => {
    return await fetchApi<{ hasViewed: boolean }>(`/storyments/${id}/viewed/${userId}`);
  }
};

// API do gerador de mentiras
export const generatorApi = {
  // Gerar uma mentira (recurso PRO)
  generateLie: async (userId: string, customTopic?: string): Promise<{ lie: string }> => {
    return await fetchApi<{ lie: string }>(
      '/generator/lie',
      'POST',
      { userId, customTopic }
    );
  }
};

// Definir a API completa com todos os componentes
export const api = {
  auth: {
    login: userApi.login,
    register: userApi.register,
    logout: async () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return { success: true };
    },
    verifyToken: async (token: string) => {
      return await fetchApi<{ valid: boolean, user?: User }>('/auth/verify', 'POST', { token });
    }
  },
  user: {
    getById: userApi.getById,
    getByUsername: userApi.getByUsername,
    update: userApi.update,
    updateSettings: userApi.updateSettings,
    getProStatus: userApi.getProStatus,
    upgradeToPro: userApi.upgradeToPro,
    getCurrentUser: async (): Promise<User | null> => {
      const userData = localStorage.getItem('userData');
      if (!userData) return null;
      try {
        return JSON.parse(userData) as User;
      } catch (e) {
        
        return null;
      }
    },
    setCurrentUser: (user: User): void => {
      localStorage.setItem('userData', JSON.stringify(user));
    },
    getProfile: userApi.getProfile
  },
  posts: {
    getAll: async () => await fetchApi<Post[]>('/posts'),
    getById: async (id: string) => await fetchApi<Post>(`/posts/${id}`),
    getByUser: async (userId: string) => await fetchApi<Post[]>(`/posts/user/${userId}`),
    create: async (postData: any) => await fetchApi<Post>('/posts', 'POST', postData),
    update: async (id: string, postData: any) => await fetchApi<Post>(`/posts/${id}`, 'PUT', postData),
    delete: async (id: string) => await fetchApi<{success: boolean}>(`/posts/${id}`, 'DELETE'),
    addReaction: async (postId: string, reaction: string) => 
      await fetchApi<Post>(`/posts/${postId}/reactions`, 'POST', { reaction }),
    addJudgement: async (postId: string, judgement: string) =>
      await fetchApi<Post>(`/posts/${postId}/judgements`, 'POST', { judgement })
  },
  storyment: storymentApi,
  generator: generatorApi
}; 