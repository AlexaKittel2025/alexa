'use client';
;
;
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';import axios from 'axios';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Notification {
  id: string;
  type: string;
  content: string;
  is_read: boolean;
  related_id: string | null;
  sender_id: string | null;
  created_at: string;
}

interface LocalNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { user, loading: userLoading } = useCurrentUser();
  const router = useRouter();

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
      
      const apiNotifications: Notification[] = response.data;
      const localNotifications = apiNotifications.map(convertToLocalNotification);
      setNotifications(localNotifications);
    } catch (error) {

      // Mock data para desenvolvimento
      const mockNotifications: LocalNotification[] = [
        {
          id: '1',
          type: 'reaction',
          title: 'Nova reação',
          message: 'João reagiu à sua mentira sobre "Comi pizza no café da manhã"',
          time: '5 minutos atrás',
          read: false,
          actionUrl: '/post/1'
        },
        {
          id: '2',
          type: 'comment',
          title: 'Novo comentário',
          message: 'Maria comentou: "Essa história é inacreditável! 😂"',
          time: '1 hora atrás',
          read: false,
          actionUrl: '/post/2'
        },
        {
          id: '3',
          type: 'follow',
          title: 'Novo seguidor',
          message: 'Pedro começou a seguir você',
          time: '2 horas atrás',
          read: true,
          actionUrl: '/perfil/pedro'
        },
        {
          id: '4',
          type: 'mention',
          title: 'Nova menção',
          message: 'Você foi mencionado em "A história mais mentirosa do dia"',
          time: '1 dia atrás',
          read: true,
          actionUrl: '/post/3'
        },
        {
          id: '5',
          type: 'system',
          title: 'Conquista desbloqueada',
          message: 'Parabéns! Você alcançou o nível 5 de Mentiroso!',
          time: '2 dias atrás',
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const convertToLocalNotification = (notification: Notification): LocalNotification => {
    return {
      id: notification.id,
      type: notification.type,
      title: getNotificationTitle(notification.type),
      message: notification.content,
      time: getTimeFromDate(notification.created_at),
      read: notification.is_read,
      actionUrl: getActionUrlForNotification(notification)
    };
  };

  const getActionUrlForNotification = (notification: Notification): string | undefined => {
    if (!notification.related_id) return undefined;
    
    switch (notification.type) {
      case 'comment':
      case 'reaction':
        return `/post/${notification.related_id}`;
      case 'follow':
        return `/perfil/${notification.sender_id}`;
      default:
        return undefined;
    }
  };

  const getNotificationTitle = (type: string): string => {
    switch (type) {
      case 'reaction':
        return 'Nova reação';
      case 'comment':
        return 'Novo comentário';
      case 'follow':
        return 'Novo seguidor';
      case 'mention':
        return 'Nova menção';
      default:
        return 'Notificação';
    }
  };

  const getTimeFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minutos atrás`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} horas atrás`;
    } else {
      return `${Math.floor(diffMins / 1440)} dias atrás`;
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'reaction':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
            <span className="text-yellow-500 dark:text-yellow-300 text-2xl">😂</span>
          </div>
        );
      case 'comment':
        return (
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <span className="text-blue-500 dark:text-blue-300 text-2xl">💬</span>
          </div>
        );
      case 'follow':
        return (
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <span className="text-green-500 dark:text-green-300 text-2xl">👥</span>
          </div>
        );
      case 'mention':
        return (
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <span className="text-purple-500 dark:text-purple-300 text-2xl">@</span>
          </div>
        );
      case 'system':
        return (
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <span className="text-purple-600 dark:text-purple-300 text-2xl">🏆</span>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
            <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
        );
    }
  };

  const markAsRead = async (id: string) => {
    if (!user?.accessToken) {
      // Mock behavior para desenvolvimento
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      return;
    }
    
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
      
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      
      // Mock behavior quando API falha
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    }
  };

  const markAllAsRead = async () => {
    if (!user?.accessToken) {
      // Mock behavior para desenvolvimento
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
      return;
    }
    
    try {
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
      
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
    } catch (error) {
      
      // Mock behavior quando API falha
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.accessToken) {
      // Mock behavior para desenvolvimento
      setNotifications(notifications.filter(notification => notification.id !== id));
      return;
    }
    
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
      
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      
      // Mock behavior quando API falha
      setNotifications(notifications.filter(notification => notification.id !== id));
    }
  };

  const deleteAllRead = async () => {
    if (!user?.accessToken) {
      // Mock behavior para desenvolvimento
      setNotifications(notifications.filter(notification => !notification.read));
      return;
    }
    
    try {
      await axios.delete('/api/notifications/read', {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
      
      setNotifications(notifications.filter(notification => !notification.read));
    } catch (error) {
      
      // Mock behavior quando API falha
      setNotifications(notifications.filter(notification => !notification.read));
    }
  };

  const handleNotificationClick = (notification: LocalNotification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  useEffect(() => {
    if (user && !userLoading) {
      fetchNotifications();
    }
  }, [user, userLoading]);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const hasUnreadNotifications = notifications.some(n => !n.read);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Notificações
          </h1>
          
          {/* Filtros e Ações */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unread' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Não lidas
              </button>
            </div>
            
            <div className="flex gap-2">
              {hasUnreadNotifications && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Marcar todas como lidas</span>
                </button>
              )}
              {notifications.some(n => n.read) && (
                <button
                  onClick={deleteAllRead}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Limpar lidas</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                  !notification.read ? 'border-2 border-purple-200 dark:border-purple-800' : 'border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getIconForType(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.time}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>
                    
                    {!notification.read && (
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-medium rounded-full">
                        Não lida
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => deleteNotification(notification.id, e)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <BellIcon className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {filter === 'unread' ? 'Sem notificações não lidas' : 'Sem notificações'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}