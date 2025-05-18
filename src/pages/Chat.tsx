;
;
;
;
import { ChatIcon, PaperAirplaneIcon, UserIcon } from '@heroicons/react/solid';
import React, { useState, useEffect, useRef } from 'react';
;
;
;
;
import { useAuth } from '../context/AuthContext';
import { 
  ChatMessage, 
  ChatRoom, 
  User 
} from '../types';
import { 
  initializeSocket, 
  closeSocket, 
  getSocket, 
  getUserChatRooms, 
  getChatMessages, 
  sendMessage, 
  markMessagesAsRead, 
  getUsersForChat,
  getGlobalChatRoom,
  getOrCreatePrivateRoom,
  retryConnection
} from '../services/chatService';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import ChatErrorDisplay from '../components/ChatErrorDisplay';

// Dados mockados para demonstração
const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'mentiroso_oficial',
    displayName: 'Mentiroso Oficial',
    email: 'mentiroso@example.com',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Eu minto desde pequeno!',
    points: 1500,
    level: 15,
    isPro: true,
    createdAt: new Date(2022, 0, 15).toISOString(),
    display_name: 'Mentiroso Oficial',
    is_pro: true,
    created_at: new Date(2022, 0, 15).toISOString()
  },
  {
    id: 'user2',
    username: 'contador_historias',
    displayName: 'Contador de Histórias',
    email: 'contador@example.com',
    photoURL: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'As melhores histórias são as que eu invento!',
    points: 980,
    level: 9,
    isPro: false,
    createdAt: new Date(2022, 2, 20).toISOString(),
    display_name: 'Contador de Histórias',
    is_pro: false,
    created_at: new Date(2022, 2, 20).toISOString()
  },
  {
    id: 'user3',
    username: 'rainha_das_mentiras',
    displayName: 'Rainha das Mentiras',
    email: 'rainha@example.com',
    photoURL: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Ninguém mente melhor que eu!',
    points: 2200,
    level: 22,
    isPro: true,
    createdAt: new Date(2021, 11, 5).toISOString(),
    location: {
      city: 'São Paulo',
      state: 'SP'
    },
    display_name: 'Rainha das Mentiras',
    is_pro: true,
    created_at: new Date(2021, 11, 5).toISOString()
  },
  {
    id: 'user4',
    username: 'inventivo123',
    displayName: 'Inventivo',
    email: 'inventivo@example.com',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    points: 850,
    level: 8,
    isPro: false,
    createdAt: new Date(2022, 4, 10).toISOString(),
    display_name: 'Inventivo',
    is_pro: false,
    created_at: new Date(2022, 4, 10).toISOString()
  },
  {
    id: 'user5',
    username: 'criativo_demais',
    displayName: 'Criativo Demais',
    email: 'criativo@example.com',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    points: 1100,
    level: 11,
    isPro: true,
    createdAt: new Date(2022, 1, 25).toISOString(),
    display_name: 'Criativo Demais',
    is_pro: true,
    created_at: new Date(2022, 1, 25).toISOString()
  }
];

const mockGlobalMessages: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    receiverId: 'global',
    content: 'E aí, pessoal! Acabei de contar uma mentira tão boa que minha mãe acreditou que eu fui aceito em Harvard. 😂',
    createdAt: new Date(2023, 6, 20, 10, 15).toISOString(),
    timestamp: new Date(2023, 6, 20, 10, 15).toISOString(),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg2',
    senderId: 'user3',
    receiverId: 'global',
    content: 'Amei sua última mentira sobre o unicórnio no shopping! Como você inventa essas coisas? 🦄',
    createdAt: new Date(2023, 6, 20, 10, 17).toISOString(),
    timestamp: new Date(2023, 6, 20, 10, 17).toISOString(),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg3',
    senderId: 'user2',
    receiverId: 'global',
    content: 'Alguém tem alguma dica para criar uma mentira sobre viagem? Quero fazer meus amigos acreditarem que fui para o Japão.',
    createdAt: new Date(2023, 6, 20, 10, 20).toISOString(),
    timestamp: new Date(2023, 6, 20, 10, 20).toISOString(),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg4',
    senderId: 'user5',
    receiverId: 'global',
    content: 'Diga que aprendeu a fazer sushi com um mestre japonês e poste fotos de sushi que você "fez", mas comprou pronto! 🍣',
    createdAt: new Date(2023, 6, 20, 10, 22).toISOString(),
    timestamp: new Date(2023, 6, 20, 10, 22).toISOString(),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg5',
    senderId: 'user4',
    receiverId: 'global',
    content: 'Estou pensando em criar uma mentira sobre ter conhecido um famoso. Quem vocês acham que seria mais plausível?',
    createdAt: new Date(2023, 6, 20, 10, 25).toISOString(),
    timestamp: new Date(2023, 6, 20, 10, 25).toISOString(),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg6',
    senderId: 'user1',
    receiverId: 'global',
    content: 'Escolha alguém que esteja em turnê na sua cidade, assim é mais crível!',
    createdAt: new Date(2023, 6, 20, 10, 27).toISOString(),
    timestamp: new Date(2023, 6, 20, 10, 27).toISOString(),
    isRead: true,
    roomId: 'global'
  }
];

const mockPrivateChats: { [chatId: string]: ChatMessage[] } = {
  'chat-user1-user3': [
    {
      id: 'priv1',
      senderId: 'user1',
      receiverId: 'user3',
      content: 'Ei, rainha! Aquela sua mentira sobre o Gordon Ramsay foi épica! 👨‍🍳',
      createdAt: new Date(2023, 6, 19, 15, 30).toISOString(),
      timestamp: new Date(2023, 6, 19, 15, 30).toISOString(),
      isRead: true,
      roomId: 'chat-user1-user3'
    },
    {
      id: 'priv2',
      senderId: 'user3',
      receiverId: 'user1',
      content: 'Valeu! Eu me inspirei naquele programa de culinária que assisti ontem. A cara dele de decepção é impagável!',
      createdAt: new Date(2023, 6, 19, 15, 35).toISOString(),
      timestamp: new Date(2023, 6, 19, 15, 35).toISOString(),
      isRead: true,
      roomId: 'chat-user1-user3'
    },
    {
      id: 'priv3',
      senderId: 'user1',
      receiverId: 'user3',
      content: 'Quer participar da batalha de mentiras comigo? Podemos criar uma dupla imbatível!',
      createdAt: new Date(2023, 6, 19, 15, 40).toISOString(),
      timestamp: new Date(2023, 6, 19, 15, 40).toISOString(),
      isRead: true,
      roomId: 'chat-user1-user3'
    },
    {
      id: 'priv4',
      senderId: 'user3',
      receiverId: 'user1',
      content: 'Claro! Vamos dominar essa batalha com nossas mentiras! 💪',
      createdAt: new Date(2023, 6, 19, 15, 42).toISOString(),
      timestamp: new Date(2023, 6, 19, 15, 42).toISOString(),
      isRead: true,
      roomId: 'chat-user1-user3'
    }
  ],
  'chat-user1-user2': [
    {
      id: 'priv5',
      senderId: 'user1',
      receiverId: 'user2',
      content: 'Cara, preciso de ideias para mentiras sobre tecnologia. Você é bom nisso!',
      createdAt: new Date(2023, 6, 18, 20, 10).toISOString(),
      timestamp: new Date(2023, 6, 18, 20, 10).toISOString(),
      isRead: true,
      roomId: 'chat-user1-user2'
    },
    {
      id: 'priv6',
      senderId: 'user2',
      receiverId: 'user1',
      content: 'Que tal dizer que hackeou a NASA com um Raspberry Pi? Ou que criou um app que foi comprado pelo Google?',
      createdAt: new Date(2023, 6, 18, 20, 15).toISOString(),
      timestamp: new Date(2023, 6, 18, 20, 15).toISOString(),
      isRead: true,
      roomId: 'chat-user1-user2'
    },
    {
      id: 'priv7',
      senderId: 'user1',
      receiverId: 'user2',
      content: 'A do app é boa! Vou elaborar isso, valeu!',
      createdAt: new Date(2023, 6, 18, 20, 20).toISOString(),
      timestamp: new Date(2023, 6, 18, 20, 20).toISOString(),
      isRead: true,
      roomId: 'chat-user1-user2'
    }
  ],
  'chat-user2-user5': [
    {
      id: 'priv8',
      senderId: 'user2',
      receiverId: 'user5',
      content: 'Vi que você é PRO. Vale a pena assinar?',
      createdAt: new Date(2023, 6, 17, 12, 0).toISOString(),
      timestamp: new Date(2023, 6, 17, 12, 0).toISOString(),
      isRead: true,
      roomId: 'chat-user2-user5'
    },
    {
      id: 'priv9',
      senderId: 'user5',
      receiverId: 'user2',
      content: 'Com certeza! O gerador de mentiras é incrível, salva muito tempo quando estou sem ideias!',
      createdAt: new Date(2023, 6, 17, 12, 5).toISOString(),
      timestamp: new Date(2023, 6, 17, 12, 5).toISOString(),
      isRead: true,
      roomId: 'chat-user2-user5'
    }
  ]
};

type ChatTab = 'global' | 'private';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ChatTab>('global');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [socketStatus, setSocketStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [userTyping, setUserTyping] = useState<{ [key: string]: boolean }>({});
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [userMenu, setUserMenu] = useState<{ userId: string; anchorEl: HTMLElement } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Função para lidar com mensagens recebidas
  const handleNewMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  // Função para lidar com usuários digitando
  const handleUserTyping = ({ roomId, userId, isTyping }: { roomId: string; userId: string; isTyping: boolean }) => {
    setUserTyping(prev => ({
      ...prev,
      [userId]: isTyping
    }));
  };

  // Função para lidar com mensagens lidas
  const handleMessageRead = ({ roomId, userId }: { roomId: string; userId: string }) => {
    setChatMessages(prev => 
      prev.map(msg => 
        msg.roomId === roomId && msg.receiverId === userId && !msg.isRead 
          ? { ...msg, isRead: true } 
          : msg
      )
    );
  };

  // Inicializar socket e carregar dados iniciais
  useEffect(() => {
    if (!user) {
      
      return;
    }

    setSocketStatus('connecting');

    // Inicializar socket com token de autenticação
    const initChat = async () => {
      try {
        
        // Inicializar socket com token do usuário
        const authToken = localStorage.getItem('token') || 'mock-token';
        const socket = initializeSocket(authToken, user.id);
        socketRef.current = socket;

        socket.on('connect', () => {
          
          setSocketStatus('connected');
          setReconnectAttempt(0);
          loadData();
        });

        socket.on('connect_error', (error) => {
          
          setSocketStatus('error');
          setReconnectAttempt(prev => prev + 1);
        });

        socket.on('message:receive', (message: ChatMessage) => {
          
          handleNewMessage(message);
        });

        socket.on('user:typing', ({ roomId, userId, isTyping }) => {
          
          handleUserTyping({ roomId, userId, isTyping });
        });

        socket.on('user:status', ({ userId, status }) => {
          
        });

        socket.on('message:read', ({ roomId, userId }) => {
          
          handleMessageRead({ roomId, userId });
        });

        socket.on('disconnect', (reason) => {
          
          setSocketStatus('connecting');
        });

        socket.on('reconnect', (attemptNumber) => {
          
          setSocketStatus('connected');
          setReconnectAttempt(0);
          loadData();
        });

        socket.on('reconnect_attempt', () => {
          setReconnectAttempt(prev => prev + 1);
        });

        socket.on('reconnect_failed', () => {
          
          setSocketStatus('error');
        });

        // Carregar dados iniciais
        await loadData();
      } catch (error) {
        
        setSocketStatus('error');
      }
    };

    initChat();

    // Limpar socket ao desmontar
    return () => {
      
      if (socketRef.current) {
        closeSocket();
        socketRef.current = null;
      }
    };
  }, [user]);

  // Função para carregar dados iniciais
  const loadData = async () => {
    try {
      if (!user) return;

      // Buscar salas de chat do usuário
      const roomsResponse = await getUserChatRooms(user.id);
      if (roomsResponse.success && roomsResponse.data) {
        
        setChatRooms(roomsResponse.data);
        
        // Se não tem sala ativa, seleciona a global
        if (!activeTab) {
          const globalRoom = roomsResponse.data.find(room => room.type === 'global');
          if (globalRoom) {
            
            setActiveTab('global');
            loadChatMessages(globalRoom.id);
          }
        }
      } else {
        
      }
    } catch (error) {
      
    }
  };

  // Rolagem automática para novas mensagens
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, activeTab]);

  // Marcar mensagens como lidas quando o chat ativo muda
  useEffect(() => {
    if (!user || !activeTab) return;
    
    markMessagesAsRead(activeTab, user.id);
  }, [user, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatMessages = async (roomId: string) => {
    if (!user) return;
    
    try {
      const response = await getChatMessages(roomId);
      if (response.success && response.data) {
        setChatMessages(response.data);
        
        // Marcar mensagens como lidas
        markMessagesAsRead(roomId, user.id);
      }
    } catch (error) {
      
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !user) return;

    const roomId = activeTab === 'global' ? 'global' : activeTab;
    if (!roomId) return;

    const messageData = {
      roomId,
      senderId: user.id,
      receiverId: '',
      content: messageInput,
      isRead: false
    };

    try {
      // Otimismo UI: adicionar mensagem localmente antes da resposta do servidor
      const optimisticMessage: ChatMessage = {
        ...messageData,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };

      if (activeTab === 'global') {
        setChatMessages(prev => [...prev, optimisticMessage]);
      } else if (activeTab) {
        setChatMessages(prev => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), optimisticMessage]
        }));
      }

      // Enviar mensagem
      const response = await sendMessage(messageData);
      
      // Limpar input
      setMessageInput('');
      
      // Se falhar, mostrar erro
      if (!response.success) {
        
        // TODO: Adicionar toast de erro
      }
    } catch (error) {
      
      // TODO: Adicionar toast de erro
    }
  };

  const handleChatRoomSelect = async (roomId: string) => {
    setActiveTab(roomId as ChatTab);
    await loadChatMessages(roomId);
  };

  const handleUserSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await getUsersForChat(value);
      if (response.success && response.data) {
        setSearchResults(response.data);
      }
    } catch (error) {
      
    }
  };

  const handleStartNewChat = async (userId: string) => {
    if (!user) return;
    
    try {
      const response = await getOrCreatePrivateRoom(user.id, userId);
      if (response.success && response.data) {
        // Adicionar sala à lista se não existir
        if (!chatRooms.some(room => room.id === response.data?.id)) {
          setChatRooms(prev => [...prev, response.data as ChatRoom]);
        }
        
        // Ativar a conversa
        setActiveTab('private');
        await loadChatMessages(response.data.id);
      }
    } catch (error) {
      
    }
    
    // Limpar pesquisa
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleInputKeyPress = () => {
    if (!user || !activeTab) return;
    
    // Informar que o usuário está digitando
    const socket = getSocket();
    if (socket) {
      socket.emit('user:typing', { 
        roomId: activeTab, 
        userId: user.id, 
        isTyping: true 
      });
      
      // Limpar status após alguns segundos
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      setTypingTimeout(setTimeout(() => {
        socket.emit('user:typing', { 
          roomId: activeTab, 
          userId: user.id, 
          isTyping: false 
        });
      }, 2000));
    }
  };

  const getUserById = (userId: string): User | null => {
    // Primeiro procurar nos usuários conectados
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) return foundUser;

    // Depois procurar nas salas de chat
    for (const room of chatRooms) {
      if (room.participants) {
        const user = room.participants.find(p => p.id === userId);
        if (user) return user;
      }
    }
    
    // Não encontrado
    return null;
  };

  const formatMessageTime = (date: string | Date | undefined) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getCurrentChatMessages = (): ChatMessage[] => {
    if (activeTab === 'global') {
      return chatMessages;
    } else if (activeTab) {
      return chatMessages[activeTab] || [];
    }
    return [];
  };

  // Função para abrir o menu do usuário
  const handleUserMenu = (userId: string, event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    setUserMenu({ userId, anchorEl: event.currentTarget });
  };

  // Função para fechar o menu
  const closeUserMenu = () => setUserMenu(null);

  // Renderizar indicador de digitação
  const renderTypingIndicator = () => {
    if (activeTab === 'private') {
      const room = chatRooms.find(room => room.id === activeTab);
      if (room && room.participants) {
        const otherUser = room.participants.find(p => p.id !== user?.id);
        if (otherUser && userTyping[otherUser.id]) {
          return (
            <div className="text-xs text-gray-500 italic ml-12 mb-2">
              {otherUser.displayName} está digitando...
            </div>
          );
        }
      }
    } else if (activeTab === 'global') {
      // Verificar se alguém está digitando no chat global
      const typingUsers = Object.entries(userTyping)
        .filter(([id, isTyping]) => isTyping && id !== user?.id)
        .map(([id]) => getUserById(id)?.displayName || id);
        
      if (typingUsers.length > 0) {
        return (
          <div className="text-xs text-gray-500 italic ml-12 mb-2">
            {typingUsers.length === 1 
              ? `${typingUsers[0]} está digitando...` 
              : `${typingUsers.length} pessoas estão digitando...`}
          </div>
        );
      }
    }
    
    return null;
  };

  // Função para tentar reconectar manualmente
  const handleRetryConnection = () => {
    if (!user) return;
    
    setSocketStatus('connecting');

    try {
      // Inicializar socket com token do usuário
      const authToken = localStorage.getItem('token') || 'mock-token';
      const socket = retryConnection(authToken, user.id);
      socketRef.current = socket;
      
      // A lógica de eventos já está configurada no initializeSocket
      // Apenas monitoramos o status aqui para atualizar a UI
      setTimeout(() => {
        if (socket.connected) {
          
          setSocketStatus('connected');
          setReconnectAttempt(0);
          loadData();
        } else {
          
          setSocketStatus('error');
        }
      }, 3000);
    } catch (error) {
      
      setSocketStatus('error');
    }
  };

  if (socketStatus === 'connecting') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (socketStatus === 'error') {
    return <ChatErrorDisplay onRetry={handleRetryConnection} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Chat</h1>
      <p className="text-gray-600 text-center mb-8">Converse com outros mentirosos em tempo real!</p>
      
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'global'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('global');
          }}
        >
          <span className="flex items-center">
            <ChatIcon className="h-5 w-5 mr-2" />
            Chat Global
          </span>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'private'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('private')}
        >
          <span className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            Chat Privado
          </span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex h-[600px]">
          {activeTab === 'private' && (
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-lg mb-2">Conversas</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar usuários..."
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchQuery}
                    onChange={handleUserSearch}
                  />
                  <div className="absolute right-3 top-2.5">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {searchQuery.length > 1 && (
                <div className="overflow-y-auto flex-1">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Buscando...
                    </div>
                  ) : (
                    searchResults.map(user => (
                      <div
                        key={user.id}
                        className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleStartNewChat(user.id)}
                      >
                        <div className="flex items-center">
                          <img
                            src={user.photoURL || "https://via.placeholder.com/150"}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full mr-3"
                          />
              <div>
                            <h3 className="font-semibold text-gray-900">{user.displayName}</h3>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {searchQuery.length <= 1 && (
                <div className="overflow-y-auto flex-1">
                  {chatRooms.filter(room => room.type === 'private').length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Nenhuma conversa iniciada.<br />
                      Busque por usuários para iniciar um chat.
                    </div>
                  ) : (
                    chatRooms
                      .filter(room => room.type === 'private')
                      .map(room => {
                        // Encontre o outro usuário na sala
                        const otherUser = room.participants?.find(p => p.id !== user?.id);
                        const lastMessage = room.lastMessage;

                        if (!otherUser) return null;

                        return (
                          <div
                            key={room.id}
                    className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                              activeTab === room.id ? 'bg-gray-50' : ''
                    }`}
                            onClick={() => handleChatRoomSelect(room.id)}
                  >
                    <div className="flex items-center">
                      <img
                                src={otherUser.photoURL || "https://via.placeholder.com/150"}
                                alt={otherUser.displayName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                                  <h3 className="font-semibold text-gray-900">{otherUser.displayName}</h3>
                                  {lastMessage && (
                            <span className="text-xs text-gray-500">
                                      {formatMessageTime(lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                                {lastMessage && (
                          <p className="text-sm text-gray-500 truncate">
                                    {lastMessage.senderId === user?.id ? 'Você: ' : ''}
                                    {lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                        );
                      })
                  )}
              </div>
              )}
            </div>
          )}
          
          <div className={`${activeTab === 'private' ? 'w-2/3' : 'w-full'} flex flex-col`}>
            <div className="flex-1 overflow-y-auto p-4">
              {(activeTab === 'global' || activeTab) ? (
              <div className="space-y-4">
                  {getCurrentChatMessages().map((message) => {
                    const messageUser = getUserById(message.senderId);
                    const isCurrentUser = message.senderId === user?.id;
                      
                      return (
                        <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className="flex max-w-[70%]">
                            {!isCurrentUser && (
                              <div className="relative">
                                <img
                                src={messageUser?.photoURL || "https://via.placeholder.com/150"}
                                alt={messageUser?.displayName}
                                  className="w-10 h-10 rounded-full mr-3 self-end cursor-pointer hover:opacity-80 transition"
                                onClick={(e) => messageUser && handleUserMenu(messageUser.id, e)}
                                />
                              {userMenu && messageUser && userMenu.userId === messageUser.id && (
                                  <div className="absolute left-12 top-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px]" onClick={e => e.stopPropagation()}>
                                    <a
                                      href="#"
                                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab('private');
                                        messageUser && handleStartNewChat(messageUser.id);
                                        closeUserMenu();
                                      }}
                                    >
                                      Chat Privado
                                    </a>
                                    <a
                                    href={`/profile/${messageUser?.username || ''}`}
                                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                      onClick={closeUserMenu}
                                    >
                                      Ver Perfil
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                            <div>
                              {!isCurrentUser && (
                                <div className="flex items-center mb-1">
                                <span className="font-medium text-gray-900 mr-2">{messageUser?.displayName}</span>
                                <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp || message.createdAt)}</span>
                                </div>
                              )}
                              <div
                                className={`rounded-lg p-3 ${
                                  isCurrentUser
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                }`}
                              >
                                <p>{message.content}</p>
                              </div>
                              {isCurrentUser && (
                                <div className="flex justify-end mt-1">
                                <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp || message.createdAt)}</span>
                                {message.isRead && (
                                  <span className="text-xs text-gray-500 ml-1">• Lida</span>
                                )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                  })}
                  {renderTypingIndicator()}
                  <div ref={messagesEndRef} />
                                </div>
              ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Selecione uma conversa para começar a conversar</p>
                    </div>
                  )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              {(activeTab === 'global' || activeTab) && (
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Digite sua mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleInputKeyPress}
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white rounded-r-lg px-4 py-2 hover:bg-opacity-90"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Fechar menu ao clicar fora */}
      {userMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeUserMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Chat; 