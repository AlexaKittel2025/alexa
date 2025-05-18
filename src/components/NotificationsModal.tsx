'use client';

import React, { useState, useEffect } from 'react';
import { CheckIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { Notification, NotificationService } from '@/services/NotificationService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationsRead?: () => void;
  onNotificationCountChange?: (count: number) => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ 
  isOpen, 
  onClose, 
  onNotificationsRead,
  onNotificationCountChange 
}) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Função para carregar as notificações do servidor
  const fetchNotifications = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/notifications?limit=50');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        
        // Atualizar contador de notificações não lidas
        if (onNotificationCountChange) {
          onNotificationCountChange(data.unreadCount || 0);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para determinar o URL de ação com base no tipo e ID relacionado
  const getActionUrlForNotification = (notification: Notification): string | undefined => {
    if (!notification.relatedId) return undefined;
    
    switch (notification.type) {
      case 'comment':
      case 'like':
        return `/post/${notification.relatedId}`;
      case 'follow':
      case 'mention':
        return `/usuario/${notification.senderId}`;
      case 'battle_challenge':
      case 'battle_result':
        return `/batalhas`;
      default:
        return undefined;
    }
  };

  // Carregar notificações quando o modal é aberto
  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchNotifications();
    }
  }, [isOpen, session]);
  
  // Monitorar notificações não lidas
  useEffect(() => {
    // Quando não houver mais notificações não lidas, notificar o componente pai
    if (notifications.length > 0 && unreadCount === 0 && onNotificationsRead) {
      onNotificationsRead();
    }
  }, [unreadCount, notifications.length, onNotificationsRead]);
  
  if (!isOpen) return null;

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return (
          <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
            <span className="text-red-500 dark:text-red-300 text-xl">❤️</span>
          </div>
        );
      case 'comment':
        return (
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <span className="text-blue-500 dark:text-blue-300 text-xl">💬</span>
          </div>
        );
      case 'follow':
        return (
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
            <span className="text-green-500 dark:text-green-300 text-xl">👥</span>
          </div>
        );
      case 'battle_challenge':
      case 'battle_result':
        return (
          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
            <span className="text-purple-500 dark:text-purple-300 text-xl">⚔️</span>
          </div>
        );
      case 'achievement':
      case 'level_up':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
            <span className="text-yellow-500 dark:text-yellow-300 text-xl">🏆</span>
          </div>
        );
      case 'mention':
        return (
          <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
            <span className="text-indigo-500 dark:text-indigo-300 text-xl">@</span>
          </div>
        );
      case 'system':
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-full">
            <span className="text-gray-500 dark:text-gray-300 text-xl">🔔</span>
          </div>
        );
    }
  };

  // Marcar todas as notificações como lidas
  const markAllAsRead = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        // Atualizar o estado local
        setNotifications(notifications.map(notification => ({
          ...notification,
          isRead: true
        })));
        setUnreadCount(0);
        
        if (onNotificationCountChange) {
          onNotificationCountChange(0);
        }
      }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };
  
  // Marcar uma única notificação como lida
  const handleItemClick = async (id: string) => {
    if (!session?.user?.id) return;
    
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.isRead) return;
    
    try {
      const response = await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      
      if (response.ok) {
        // Atualizar o estado local
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        if (onNotificationCountChange) {
          onNotificationCountChange(Math.max(0, unreadCount - 1));
        }
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  // Excluir uma notificação
  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita acionar o handleItemClick do container pai
    
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const notification = notifications.find(n => n.id === id);
        if (!notification?.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
          
          if (onNotificationCountChange) {
            onNotificationCountChange(Math.max(0, unreadCount - 1));
          }
        }
        
        // Atualizar o estado local
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const hasUnreadNotifications = unreadCount > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-40 dark:bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">Notificações</h2>
            <button 
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <XIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Carregando notificações...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(notification => {
              const actionUrl = getActionUrlForNotification(notification);
              const NotificationContent = (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.sender && (
                      <span className="font-semibold">
                        {notification.sender.displayName}
                      </span>
                    )}
                    {notification.sender && ' '}
                    {notification.content}
                  </p>
                </div>
              );
              
              return (
                <div 
                  key={notification.id} 
                  className={`p-4 flex cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-10' : ''}`}
                  onClick={() => handleItemClick(notification.id)}
                >
                  <div className="flex-shrink-0 mr-4">
                    {getIconForType(notification.type)}
                  </div>
                  {actionUrl ? (
                    <Link href={actionUrl} className="flex-1 min-w-0">
                      {NotificationContent}
                    </Link>
                  ) : (
                    NotificationContent
                  )}
                  <div className="flex-shrink-0 ml-2 flex items-start space-x-1">
                    {!notification.isRead && (
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    )}
                    <button 
                      onClick={(e) => deleteNotification(notification.id, e)}
                      className="text-gray-400 hover:text-red-500 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                      aria-label="Excluir notificação"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">Sem notificações</p>
            </div>
          )}
        </div>
        
        {hasUnreadNotifications && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              className="flex items-center justify-center w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              onClick={markAllAsRead}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsModal; 