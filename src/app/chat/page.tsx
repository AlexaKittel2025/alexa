'use client';

import { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import AuthCheck from '@/components/Auth/AuthCheck';
import GlobalChat from '@/components/Chat/GlobalChat';
import { FaGlobe, FaUserFriends } from 'react-icons/fa';

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'private'>('global');

  return (
    <AuthCheck>
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Chat</h1>
            <p className="text-gray-600">
              Converse com outros usuários do Mentei em tempo real.
            </p>
          </div>
          
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('global')}
              className={`flex items-center px-4 py-2 font-medium text-sm ${
                activeTab === 'global'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaGlobe className="mr-2" /> Chat Global
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`flex items-center px-4 py-2 font-medium text-sm ${
                activeTab === 'private'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaUserFriends className="mr-2" /> Chat Privado
            </button>
          </div>
          
          {activeTab === 'global' ? (
            <GlobalChat />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaUserFriends className="mx-auto text-purple-500 text-4xl mb-4" />
              <h2 className="text-xl font-semibold mb-2">Chat Privado</h2>
              <p className="text-gray-600 mb-4">
                O chat privado estará disponível em breve! Você poderá conversar com outros usuários individualmente.
              </p>
              <p className="text-gray-500">
                Por enquanto, utilize o chat global para conversar com todos os usuários.
              </p>
            </div>
          )}
        </div>
      </MainLayout>
    </AuthCheck>
  );
} 