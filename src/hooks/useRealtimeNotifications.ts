import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Ably } from 'ably';
import { Notification } from '@/services/NotificationService';

export function useRealtimeNotifications(onNotification?: (notification: Notification) => void) {
  const { data: session } = useSession();
  const [connected, setConnected] = useState(false);
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const initAbly = async () => {
      try {
        // Obter token Ably
        const response = await fetch('/api/ably-token');
        const data = await response.json();
        
        if (!data.token) {
          console.error('Erro ao obter token Ably');
          return;
        }

        // Inicializar Ably
        const ablyInstance = new Ably.Realtime(data.token);
        
        // Conectar ao canal de notificações do usuário
        const channel = ablyInstance.channels.get(`user:${session.user.id}:notifications`);
        
        // Escutar novas notificações
        channel.subscribe('new-notification', (message) => {
          if (onNotification && message.data) {
            onNotification(message.data as Notification);
          }
        });

        // Monitorar status da conexão
        ablyInstance.connection.on('connected', () => {
          setConnected(true);
          console.log('Conectado ao Ably');
        });

        ablyInstance.connection.on('disconnected', () => {
          setConnected(false);
          console.log('Desconectado do Ably');
        });

        setAbly(ablyInstance);
      } catch (error) {
        console.error('Erro ao inicializar Ably:', error);
      }
    };

    initAbly();

    // Cleanup
    return () => {
      if (ably) {
        ably.close();
      }
    };
  }, [session?.user?.id]);

  return { connected };
}