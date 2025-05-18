import axios from 'axios';
import { getApiUrl } from '../config';

// Cria uma instância do axios com configurações padrão
const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptadores para adicionar o token de autenticação automaticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptadores para tratamento de erros padrão
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detalhado do erro para desenvolvimento

    // Tratamento específico para erros comuns
    if (error.response?.status === 401) {
      // Redirecionar para login ou mostrar modal
      
      // TODO: Implementar redirecionamento ou notificação
    }

    return Promise.reject(error);
  }
);

export default apiClient; 