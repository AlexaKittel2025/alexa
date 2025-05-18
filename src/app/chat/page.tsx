'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import AuthCheck from '@/components/Auth/AuthCheck';
import { FaGlobe, FaUserFriends, FaSearch, FaPaperPlane, FaComment } from 'react-icons/fa';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';

// Lazy load do componente GlobalChat
const GlobalChat = dynamic(() => import('@/components/Chat/GlobalChat'), {
  loading: () => <div className="flex justify-center items-center h-64"><span>Carregando chat...</span></div>,
  ssr: false
});

// Mock de conversas
const mockConversations = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'João Silva',
      username: 'joaosilva',
      avatar: generateRealPersonAvatar('men'),
      isOnline: true
    },
    lastMessage: 'Oi! Como você está?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    unread: 2
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Maria Santos',
      username: 'mariasantos',
      avatar: generateRealPersonAvatar('women'),
      isOnline: false
    },
    lastMessage: 'Viu o último post?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    unread: 0
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Pedro Costa',
      username: 'pedrocosta',
      avatar: generateRealPersonAvatar('men'),
      isOnline: true
    },
    lastMessage: 'Hahaha muito bom!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    unread: 0
  }
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<'private' | 'global'>('private');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}min`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  return (
    <AuthCheck>
      <div className="h-[calc(100vh-8rem)]">
        <div className="flex h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          {/* Lista de conversas */}
          <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mensagens</h1>
              
              {/* Tabs */}
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveTab('private')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === 'private'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Privadas
                </button>
                <button
                  onClick={() => setActiveTab('global')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === 'global'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Global
                </button>
              </div>

              {/* Busca */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar mensagens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Lista de conversas */}
            <div className="overflow-y-auto h-[calc(100%-200px)]">
              {activeTab === 'private' ? (
                <div>
                  {mockConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation)}
                      className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        selectedChat?.id === conversation.id ? 'bg-gray-50 dark:bg-gray-800' : ''
                      }`}
                    >
                      <div className="relative mr-3">
                        <img
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {conversation.user.name}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="ml-2 bg-purple-600 text-white text-xs rounded-full px-2 py-1">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <FaGlobe className="mx-auto text-purple-500 text-3xl mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Junte-se ao chat global para conversar com todos os usuários
                    </p>
                    <button
                      onClick={() => setSelectedChat({ id: 'global', user: { name: 'Chat Global' } })}
                      className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
                    >
                      Entrar no Chat Global
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Área do chat */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Header do chat */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    {selectedChat.id !== 'global' && selectedChat.user.avatar && (
                      <img
                        src={selectedChat.user.avatar}
                        alt={selectedChat.user.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedChat.user.name}
                      </p>
                      {selectedChat.id !== 'global' && selectedChat.user.isOnline && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Área de mensagens */}
                <div className="flex-1 overflow-y-auto p-4">
                  {selectedChat.id === 'global' ? (
                    <GlobalChat />
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <p>Sem mensagens por enquanto.</p>
                      <p className="text-sm mt-2">Envie uma mensagem para começar a conversa!</p>
                    </div>
                  )}
                </div>

                {/* Input de mensagem */}
                {selectedChat.id !== 'global' && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form 
                      className="flex items-center space-x-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        // Aqui você implementaria o envio da mensagem
                        setNewMessage('');
                      }}
                    >
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                      >
                        <FaPaperPlane className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FaComment className="mx-auto text-gray-300 dark:text-gray-700 text-6xl mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Selecione uma conversa para começar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}