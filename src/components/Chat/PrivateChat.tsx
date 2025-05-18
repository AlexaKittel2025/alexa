'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSearch, FaSpinner, FaUser, FaTimes } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { usePrivateChat } from '@/hooks/usePrivateChat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: string;
  username: string;
  display_name: string;
  image: string | null;
  isOnline: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  readAt: string | null;
  sender: User;
  receiver: User;
}

interface Conversation {
  id: string;
  participant: User;
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
}

interface PrivateChatProps {
  onClose?: () => void;
}

export default function PrivateChat({ onClose }: PrivateChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const { user } = useCurrentUser();
  const { messages, setMessages, sendRealtimeMessage } = usePrivateChat(
    user?.id,
    selectedConversation?.id
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar conversas
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Carregar mensagens quando selecionar conversa
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Buscar usuários com debounce
  useEffect(() => {
    if (searchQuery.trim()) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(searchQuery);
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages');
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedConversation.id,
          content: newMessage
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        
        // Enviar mensagem em tempo real
        await sendRealtimeMessage(message);
        
        // Atualizar última mensagem na conversa
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: {
                  content: message.content,
                  createdAt: message.createdAt,
                  senderId: message.senderId
                }
              }
            : conv
        ));
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      setSearching(true);
      const response = await fetch(`/api/messages/search?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setSearching(false);
    }
  };

  const startConversation = (user: User) => {
    // Verificar se já existe conversa
    const existingConversation = conversations.find(conv => conv.id === user.id);
    
    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      // Criar nova conversa temporária
      const newConversation: Conversation = {
        id: user.id,
        participant: user,
        lastMessage: null,
        unreadCount: 0
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
    
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Lista de conversas */}
      <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Mensagens</h2>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              {showSearch ? <FaTimes /> : <FaSearch />}
            </button>
          </div>

          {/* Busca de usuários */}
          {showSearch && (
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              
              {/* Resultados da busca */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-10">
                  {searching ? (
                    <div className="p-4 text-center">
                      <FaSpinner className="animate-spin mx-auto text-gray-400" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(user => (
                      <button
                        key={user.id}
                        onClick={() => startConversation(user)}
                        className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.display_name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                            <FaUser className="text-gray-600 dark:text-gray-400" />
                          </div>
                        )}
                        <div className="text-left">
                          <p className="font-medium">{user.display_name}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                        {user.isOnline && (
                          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-500">Nenhum usuário encontrado</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lista de conversas */}
        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {loading ? (
            <div className="p-4 text-center">
              <FaSpinner className="animate-spin mx-auto text-gray-400" />
            </div>
          ) : conversations.length > 0 ? (
            conversations.map(conversation => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-50 dark:bg-gray-800' : ''
                }`}
              >
                {conversation.participant.image ? (
                  <img
                    src={conversation.participant.image}
                    alt={conversation.participant.display_name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                    <FaUser className="text-gray-600 dark:text-gray-400" />
                  </div>
                )}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{conversation.participant.display_name}</p>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conversation.lastMessage.senderId === user?.id ? 'Você: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                  {conversation.unreadCount > 0 && (
                    <span className="ml-auto bg-purple-600 text-white text-xs rounded-full px-2 py-1">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>Nenhuma conversa ainda</p>
              <p className="text-sm mt-2">Busque por usuários para começar uma conversa</p>
            </div>
          )}
        </div>
      </div>

      {/* Área do chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header do chat */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              {selectedConversation.participant.image ? (
                <img
                  src={selectedConversation.participant.image}
                  alt={selectedConversation.participant.display_name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                  <FaUser className="text-gray-600 dark:text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-medium">{selectedConversation.participant.display_name}</p>
                {selectedConversation.participant.isOnline && (
                  <p className="text-xs text-green-500">Online</p>
                )}
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.senderId === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderId === user?.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensagem */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">Selecione uma conversa</p>
              <p className="text-sm">ou busque por usuários para começar</p>
            </div>
          </div>
        )}
      </div>

      {/* Botão fechar no mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}