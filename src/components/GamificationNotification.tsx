'use client';

import { useState, useEffect } from 'react';
import { FaTrophy, FaStar, FaCoins, FaLevelUpAlt } from 'react-icons/fa';
import { Achievement } from '@/lib/gamification';

interface Notification {
  id: string;
  type: 'achievement' | 'levelUp' | 'badge' | 'coins';
  title: string;
  message: string;
  icon?: React.ReactNode;
  data?: any;
  timestamp: number;
}

export default function GamificationNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Listen for gamification events
    const handleGamificationEvent = (event: CustomEvent) => {
      const { type, data } = event.detail;
      
      let notification: Notification | null = null;
      
      switch (type) {
        case 'achievement':
          notification = {
            id: `achievement-${Date.now()}`,
            type: 'achievement',
            title: 'Nova Conquista!',
            message: `${data.title} - ${data.description}`,
            icon: <FaTrophy className="text-yellow-500" size={32} />,
            data,
            timestamp: Date.now()
          };
          break;
          
        case 'levelUp':
          notification = {
            id: `levelup-${Date.now()}`,
            type: 'levelUp',
            title: 'Level Up!',
            message: `Você alcançou o nível ${data.level} - ${data.title}`,
            icon: <FaLevelUpAlt className="text-purple-500" size={32} />,
            data,
            timestamp: Date.now()
          };
          break;
          
        case 'badge':
          notification = {
            id: `badge-${Date.now()}`,
            type: 'badge',
            title: 'Novo Badge!',
            message: `${data.name} foi desbloqueado!`,
            icon: <FaStar className="text-indigo-500" size={32} />,
            data,
            timestamp: Date.now()
          };
          break;
          
        case 'coins':
          notification = {
            id: `coins-${Date.now()}`,
            type: 'coins',
            title: 'Moedas Recebidas!',
            message: `+${data.amount} moedas por ${data.reason}`,
            icon: <FaCoins className="text-yellow-600" size={32} />,
            data,
            timestamp: Date.now()
          };
          break;
      }
      
      if (notification) {
        showNotification(notification);
      }
    };
    
    window.addEventListener('gamification-event', handleGamificationEvent as EventListener);
    
    return () => {
      window.removeEventListener('gamification-event', handleGamificationEvent as EventListener);
    };
  }, []);
  
  const showNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
    setCurrentNotification(notification);
    setVisible(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification(notification.id);
    }, 5000);
  };
  
  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    if (currentNotification?.id === id) {
      const remaining = notifications.filter(n => n.id !== id);
      if (remaining.length > 0) {
        setCurrentNotification(remaining[0]);
      } else {
        setVisible(false);
        setCurrentNotification(null);
      }
    }
  };
  
  if (!visible || !currentNotification) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm animate-slide-in-right">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {currentNotification.icon}
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">
              {currentNotification.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {currentNotification.message}
            </p>
            
            {currentNotification.type === 'achievement' && currentNotification.data && (
              <div className="mt-3 flex items-center text-sm">
                <FaCoins className="text-yellow-500 mr-1" />
                <span className="text-gray-700 mr-3">
                  +{currentNotification.data.coinReward} moedas
                </span>
                <FaStar className="text-purple-500 mr-1" />
                <span className="text-gray-700">
                  +{currentNotification.data.xpReward} XP
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => hideNotification(currentNotification.id)}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

// Função helper para disparar eventos
export function triggerGamificationEvent(type: string, data: any) {
  const event = new CustomEvent('gamification-event', {
    detail: { type, data }
  });
  window.dispatchEvent(event);
}