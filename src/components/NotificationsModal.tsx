import React, { useState, useEffect } from 'react';
import { XIcon, CheckIcon, TrashIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationsRead: () => void;
  onNotificationCountChange?: (count: number) => void;
}

// Interface para as notificações retornadas pela API
interface Notification {
  id: string;
  type: string;
  content: string;
  is_read: boolean;
  related_id: string | null;
  sender_id: string | null;
  created_at: string;
}

// Interface local para lidar com as notificações dentro do componente
interface LocalNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ 
  isOpen, 
  onClose, 
  onNotificationsRead,
  onNotificationCountChange 
}) => {
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  
  // Função para carregar as notificações do servidor
  const fetchNotifications = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const apiNotifications: Notification[] = response.data;
      const localNotifications = apiNotifications.map(convertToLocalNotification);
      setNotifications(localNotifications);
      
      // Atualizar contador de notificações não lidas
      if (onNotificationCountChange) {
        const unreadCount = apiNotifications.filter(n => !n.is_read).length;
        onNotificationCountChange(unreadCount);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para converter uma notificação da API para o formato local
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
  
  // Função para determinar o URL de ação com base no tipo e ID relacionado
  const getActionUrlForNotification = (notification: Notification): string | undefined => {
    if (!notification.related_id) return undefined;
    
    switch (notification.type) {
      case 'comment':
      case 'reaction':
        return `/post/${notification.related_id}`;
      case 'follow':
        return `/profile/${notification.sender_id}`;
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

  // Carregar notificações quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, token]);
  
  // Monitorar notificações não lidas
  useEffect(() => {
    // Quando não houver mais notificações não lidas, notificar o componente pai
    if (notifications.length > 0 && !notifications.some(n => !n.read)) {
      onNotificationsRead();
    }
    
    // Notificar o componente pai sobre a quantidade de notificações não lidas
    const unreadCount = notifications.filter(n => !n.read).length;
    if (onNotificationCountChange) {
      onNotificationCountChange(unreadCount);
    }
  }, [notifications, onNotificationsRead, onNotificationCountChange]);
  
  if (!isOpen) return null;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'reaction':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
            <span className="text-yellow-500 dark:text-yellow-300 text-xl">😂</span>
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
      case 'mention':
        return (
          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
            <span className="text-purple-500 dark:text-purple-300 text-xl">@</span>
          </div>
        );
      case 'system':
        return (
          <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-2 rounded-full">
            <span className="text-primary text-xl">🏆</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Marcar todas as notificações como lidas
  const markAllAsRead = async () => {
    if (!token) return;
    
    try {
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualizar o estado local
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  };
  
  // Marcar uma única notificação como lida
  const handleItemClick = async (id: string) => {
    if (!token) return;
    
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualizar o estado local
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Excluir uma notificação
  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita acionar o handleItemClick do container pai
    
    if (!token) return;
    
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualizar o estado local
    setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  const hasUnreadNotifications = notifications.some(n => !n.read);

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
              <p className="text-gray-600 dark:text-gray-400">Carregando notificações...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 flex cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-10' : ''}`}
                onClick={() => handleItemClick(notification.id)}
              >
                <div className="flex-shrink-0 mr-4">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2 flex items-start space-x-1">
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
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
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">Sem notificações</p>
            </div>
          )}
        </div>
        
        {hasUnreadNotifications && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              className="flex items-center justify-center w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
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