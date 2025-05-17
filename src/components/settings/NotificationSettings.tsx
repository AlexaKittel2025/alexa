import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { BellIcon } from '@heroicons/react/outline';
import ChatAlt2Icon from '@heroicons/react/outline/ChatAlt2Icon';
import TagIcon from '@heroicons/react/outline/TagIcon';
import UserGroupIcon from '@heroicons/react/outline/UserGroupIcon';
import UserIcon from '@heroicons/react/outline/UserIcon';
import * as userApi from '../../services/userApi';

interface NotificationSettingsProps {
  currentUser: User;
}

interface NotificationChannels {
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  channels: NotificationChannels;
}

interface NotificationSettings {
  globalEnabled: boolean;
  categories: {
    [key: string]: NotificationChannels;
  };
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ currentUser }) => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalEnabled, setGlobalEnabled] = useState(currentUser.settings?.notifications?.globalEnabled ?? true);
  const [notificationCategories, setNotificationCategories] = useState<NotificationCategory[]>([
    {
      id: 'comments',
      name: 'Comentários',
      description: 'Notificações sobre comentários em suas postagens ou respostas aos seus comentários',
      icon: <ChatAlt2Icon className="h-6 w-6 text-gray-500" />,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'mentions',
      name: 'Marcações',
      description: 'Quando alguém mencionar você em um post ou comentário',
      icon: <TagIcon className="h-6 w-6 text-gray-500" />,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'reminders',
      name: 'Lembretes',
      description: 'Lembretes sobre eventos, desafios e outras atividades',
      icon: <BellIcon className="h-6 w-6 text-gray-500" />,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'activity',
      name: 'Mais atividade sobre você',
      description: 'Quando suas postagens receberem reações ou forem compartilhadas',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M5.076 7.8l3.181-3.183a8.25 8.25 0 0113.803 3.7M5.076 7.8h4.992" />
            </svg>,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'friends',
      name: 'Atualizações de amigos',
      description: 'Quando seus amigos postarem ou tiverem atividade relevante',
      icon: <UserGroupIcon className="h-6 w-6 text-gray-500" />,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'requests',
      name: 'Pedidos de amizade',
      description: 'Quando alguém quiser se conectar com você',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'suggestions',
      name: 'Pessoas que talvez você conheça',
      description: 'Sugestões de pessoas para seguir baseadas em seus interesses',
      icon: <UserIcon className="h-6 w-6 text-gray-500" />,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'birthdays',
      name: 'Aniversários',
      description: 'Lembretes sobre aniversários de amigos',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'groups',
      name: 'Grupos',
      description: 'Atividades e atualizações em grupos que você participa',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>,
      channels: { push: true, email: true, sms: true }
    },
    {
      id: 'videos',
      name: 'Vídeo',
      description: 'Notificações sobre novos vídeos e conteúdo de criadores que você segue',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500">
              <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>,
      channels: { push: true, email: true, sms: true }
    },
  ]);

  const toggleChannel = (categoryId: string, channel: 'push' | 'email' | 'sms') => {
    setNotificationCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              channels: {
                ...category.channels,
                [channel]: !category.channels[channel]
              }
            }
          : category
      )
    );
  };

  const handleSave = () => {
    // Aqui você enviaria as configurações para a API
    setMessage("Configurações de notificação salvas com sucesso!");
    
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notificações</h1>
        <div className="flex items-center">
          <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
            {globalEnabled ? 'Ativas' : 'Desativadas'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={globalEnabled}
              onChange={() => setGlobalEnabled(!globalEnabled)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {message && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
          {message}
        </div>
      )}

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          O Mentei poderá enviar notificações importantes sobre sua conta e conteúdo, independentemente das suas configurações de notificação preferidas.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quais notificações você recebe</h2>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="col-span-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">Tipo de notificação</span>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-4">
              <div className="text-center">
                <span className="font-medium text-gray-700 dark:text-gray-200">Push</span>
              </div>
              <div className="text-center">
                <span className="font-medium text-gray-700 dark:text-gray-200">Email</span>
              </div>
              <div className="text-center">
                <span className="font-medium text-gray-700 dark:text-gray-200">SMS</span>
              </div>
            </div>
          </div>
          
          {notificationCategories.map((category) => (
            <div key={category.id} className="grid grid-cols-4 p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30">
              <div className="col-span-1 flex items-center">
                <div className="mr-3">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{category.description}</p>
                </div>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-4 items-center">
                <div className="flex justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={globalEnabled && category.channels.push}
                      onChange={() => toggleChannel(category.id, 'push')}
                      disabled={!globalEnabled}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                  </label>
                </div>
                <div className="flex justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={globalEnabled && category.channels.email}
                      onChange={() => toggleChannel(category.id, 'email')}
                      disabled={!globalEnabled}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                  </label>
                </div>
                <div className="flex justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={globalEnabled && category.channels.sms}
                      onChange={() => toggleChannel(category.id, 'sms')}
                      disabled={!globalEnabled}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings; 