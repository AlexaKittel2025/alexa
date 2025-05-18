'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function MessageIndicator() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      
      // Atualizar a cada 30 segundos
      const interval = setInterval(loadUnreadCount, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const response = await fetch('/api/messages/unread');
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens não lidas:', error);
    }
  };

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
}