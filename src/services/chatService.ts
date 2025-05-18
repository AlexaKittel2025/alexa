import axios from 'axios';
import { ChatMessage, ChatRoom, ApiResponse, User } from '../types';
import { io, Socket } from 'socket.io-client';

// Corrigindo a URL do API_URL para usar a porta correta (3001)
const API_URL = 'http://localhost:3001';
let socket: Socket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// Inicializa a conexão com o Socket.io
export const initializeSocket = (token: string, userId: string) => {

  if (socket) {
    
    socket.disconnect();
  }
  
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  reconnectAttempts = 0;

  try {
    socket = io(API_URL, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 2000,
      timeout: 10000,
      transports: ['websocket', 'polling'] // Garantir que tente ambos métodos de transporte
    });

    // Configurar todos os event listeners
    socket.on('connect', () => {
      
      socket?.emit('user:online', { userId });
      reconnectAttempts = 0;
    });

    socket.on('connect:success', (data) => {
      
    });

    socket.on('connect_error', (error) => {
      
      reconnectAttempts++;

      // Verificar se o servidor está acessível com uma requisição HTTP simples
      axios.get(`${API_URL}/status`)
        .then(response => {
          
        })
        .catch(err => {
          
        });
    });

    socket.on('disconnect', (reason) => {

      // Tentar reconectar em caso de desconexão
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        
        if (socket) {
          socket.connect();
        }
      }, 3000);
    });

    socket.on('reconnect', (attemptNumber) => {
      
      socket?.emit('user:online', { userId });
      reconnectAttempts = 0;
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      
    });

    socket.on('reconnect_error', (error) => {
      
    });

    socket.on('reconnect_failed', () => {
      
    });

    return socket;
  } catch (error) {
    
    throw error;
  }
};

// Fecha a conexão com o Socket.io
export const closeSocket = () => {
  if (socket) {
    
    socket.disconnect();
    socket = null;
  }
  
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

// Força uma nova tentativa de conexão
export const retryConnection = (token: string, userId: string) => {
  
  closeSocket();
  return initializeSocket(token, userId);
};

// Obtém o objeto socket
export const getSocket = (): Socket | null => {
  return socket;
};

// API para buscar salas de chat
export const getUserChatRooms = async (userId: string): Promise<ApiResponse<ChatRoom[]>> => {
  try {
    
    const response = await axios.get(`${API_URL}/api/chat/rooms/${userId}`);
    return response.data;
  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao buscar salas de chat'
    };
  }
};

// API para buscar mensagens de uma sala
export const getChatMessages = async (roomId: string): Promise<ApiResponse<ChatMessage[]>> => {
  try {
    
    const response = await axios.get(`${API_URL}/api/chat/messages/${roomId}`);
    return response.data;
  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao buscar mensagens'
    };
  }
};

// API para enviar uma mensagem
export const sendMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp' | 'createdAt'>): Promise<ApiResponse<ChatMessage>> => {
  try {
    
    const response = await axios.post(`${API_URL}/api/chat/messages`, message);
    
    // Emitir a mensagem via socket
    if (socket && response.data.success) {
      
      socket.emit('message:send', response.data.data);
    }
    
    return response.data;
  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao enviar mensagem'
    };
  }
};

// API para criar um novo chat
export const createChatRoom = async (userId: string, receiverId: string): Promise<ApiResponse<ChatRoom>> => {
  try {
    
    const response = await axios.post(`${API_URL}/api/chat/rooms`, {
      participantIds: [userId, receiverId],
      type: 'private'
    });
    return response.data;
  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao criar sala de chat'
    };
  }
};

// API para marcar mensagens como lidas
export const markMessagesAsRead = async (roomId: string, userId: string): Promise<ApiResponse<void>> => {
  try {
    
    const response = await axios.put(`${API_URL}/api/chat/messages/read`, {
      roomId,
      receiverId: userId
    });
    return response.data;
  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao marcar mensagens como lidas'
    };
  }
};

// API para buscar usuários para chat
export const getUsersForChat = async (query: string): Promise<ApiResponse<User[]>> => {
  try {
    
    const response = await axios.get(`${API_URL}/api/users/search?query=${query}`);
    return response.data;
  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao buscar usuários'
    };
  }
};

// API para obter a sala de chat global
export const getGlobalChatRoom = async (): Promise<ApiResponse<ChatRoom>> => {
  try {
    
    const response = await axios.get(`${API_URL}/api/chat/rooms/global`);
    return response.data;
  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao buscar sala de chat global'
    };
  }
};

// API para obter ou criar uma sala de chat privado
export const getOrCreatePrivateRoom = async (userId: string, receiverId: string): Promise<ApiResponse<ChatRoom>> => {
  try {
    
    const response = await axios.post(`${API_URL}/api/chat/rooms/private`, {
      userId,
      receiverId
    });
    return response.data;
  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao obter/criar sala de chat privado'
    };
  }
}; 