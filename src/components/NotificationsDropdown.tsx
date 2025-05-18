'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaUserPlus, FaTrophy, FaStar, FaBell } from 'react-icons/fa';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'system';
  title: string;
  message: string;
  from?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  postId?: string;
  createdAt: Date;
  read: boolean;
}

// Mock de notificações
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'Nova curtida',
    message: 'curtiu sua mentira',
    from: {
      id: '2',
      name: 'Maria Silva',
      username: 'mariasilva',
      avatar: '/images/avatar-placeholder.jpg'
    },
    postId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
    read: false
  },
  {
    id: '2',
    type: 'comment',
    title: 'Novo comentário',
    message: 'comentou: "Que mentira criativa!"',
    from: {
      id: '3',
      name: 'João Santos',
      username: 'joaosantos',
      avatar: '/images/avatar-placeholder.jpg'
    },
    postId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    read: false
  },
  {
    id: '3',
    type: 'follow',
    title: 'Novo seguidor',
    message: 'começou a seguir você',
    from: {
      id: '4',
      name: 'Ana Costa',
      username: 'anacosta',
      avatar: '/images/avatar-placeholder.jpg'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
    read: true
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Nova conquista!',
    message: 'Você desbloqueou: Mentiroso Iniciante',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    read: true
  }
];

const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Contador de notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-red-500" />;
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'follow':
        return <FaUserPlus className="text-green-500" />;
      case 'achievement':
        return <FaTrophy className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão de notificações */}
      <div 
        onClick={handleToggle}
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer w-full"
      >
        <div className="relative">
          <FaHeart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:block dark:text-white">Notificações</span>
      </div>

      {/* Dropdown de notificações */}
      {isOpen && (
        <div className="absolute left-full ml-4 top-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-white">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary hover:underline"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>

          {/* Lista de notificações */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Nenhuma notificação ainda
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Ícone ou avatar */}
                    {notification.from ? (
                      <img
                        src={notification.from.avatar}
                        alt={notification.from.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                    )}

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <p className="text-sm dark:text-white">
                        {notification.from && (
                          <Link 
                            href={`/usuario/${notification.from.username}`}
                            className="font-semibold hover:underline"
                          >
                            {notification.from.name}
                          </Link>
                        )}
                        {notification.from && ' '}
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(notification.createdAt, { 
                          addSuffix: true,
                          locale: ptBR 
                        })}
                      </p>
                    </div>

                    {/* Indicador de não lida */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <Link 
            href="/notificacoes"
            className="block p-3 text-center text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700 border-t dark:border-gray-700"
          >
            Ver todas as notificações
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;