'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import AuthCheck from '@/components/Auth/AuthCheck';
import { FaGlobe, FaUserFriends } from 'react-icons/fa';

// Lazy load dos componentes de chat
const GlobalChat = dynamic(() => import('@/components/Chat/GlobalChatV2'), {
  loading: () => <div className="flex justify-center items-center h-64"><span>Carregando chat...</span></div>,
  ssr: false
});

const PrivateChat = dynamic(() => import('@/components/Chat/PrivateChat'), {
  loading: () => <div className="flex justify-center items-center h-64"><span>Carregando chat...</span></div>,
  ssr: false
});

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<'private' | 'global'>('private');

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Chat</h1>
          
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('private')}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'private'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <FaUserFriends />
                Mensagens Privadas
              </div>
              {activeTab === 'private' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('global')}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'global'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <FaGlobe />
                Chat Global
              </div>
              {activeTab === 'global' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
              )}
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="h-[calc(100vh-200px)]">
          {activeTab === 'private' ? (
            <PrivateChat />
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm h-full">
              <GlobalChat />
            </div>
          )}
        </div>
      </div>
    </AuthCheck>
  );
}