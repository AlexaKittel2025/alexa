import { useState, useEffect, useRef } from 'react';
import { getAblyClient } from '@/lib/ably';
import * as Ably from 'ably';

interface User {
  id: string;
  username: string;
  display_name: string;
  image: string | null;
  isOnline: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  readAt: string | null;
  sender: User;
  receiver: User;
}

export function usePrivateChat(currentUserId: string | undefined, otherUserId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<Ably.Types.RealtimeChannelPromise | null>(null);

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    let isMounted = true;
    const channelName = `private:${[currentUserId, otherUserId].sort().join('-')}`;

    const initializeAbly = async () => {
      try {
        const ably = getAblyClient();
        const channel = ably.channels.get(channelName);
        channelRef.current = channel;

        // Inscrever-se para receber mensagens
        await channel.subscribe('message', (message: Ably.Types.Message) => {
          if (isMounted) {
            const newMessage = message.data as Message;
            setMessages(prev => [...prev, newMessage]);
          }
        });

        // Notificar que usuário está online
        await channel.presence.enter({
          userId: currentUserId,
          timestamp: new Date().toISOString()
        });

        // Escutar mudanças de presença
        channel.presence.subscribe('enter', (member) => {
          if (isMounted) {
            console.log('Usuário entrou:', member.data);
          }
        });

        channel.presence.subscribe('leave', (member) => {
          if (isMounted) {
            console.log('Usuário saiu:', member.data);
          }
        });

        setConnected(true);
      } catch (error) {
        console.error('Erro ao conectar ao Ably:', error);
        setConnected(false);
      }
    };

    initializeAbly();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        channelRef.current.presence.leave();
        channelRef.current.unsubscribe();
      }
    };
  }, [currentUserId, otherUserId]);

  const sendRealtimeMessage = async (message: Message) => {
    if (channelRef.current) {
      try {
        await channelRef.current.publish('message', message);
      } catch (error) {
        console.error('Erro ao enviar mensagem em tempo real:', error);
      }
    }
  };

  return {
    messages,
    connected,
    sendRealtimeMessage,
    setMessages
  };
}