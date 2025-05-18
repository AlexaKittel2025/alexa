'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaComment, FaPaperPlane, FaSmile } from 'react-icons/fa';
import { useAuth } from '@/providers/AuthProvider';
import { loadChatMessages, saveChatMessages } from '@/utils/persistenceUtils';
import { getAblyClient } from '@/lib/ably';
import * as Ably from 'ably';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

const GlobalChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<Ably.Types.RealtimeChannelPromise | null>(null);

  // Scroll para o final das mensagens quando receber novas
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Conectar ao Ably quando o chat abrir
  useEffect(() => {
    if (isOpen && user) {
      let isMounted = true;
      
      const initializeAbly = async () => {
        try {
          const ably = getAblyClient();
          const channel = ably.channels.get('chat:global');
          channelRef.current = channel;
          
          // Inscrever-se para receber mensagens
          await channel.subscribe('message', (message: Ably.Types.Message) => {
            if (isMounted) {
              const newMessage = message.data as Message;
              setMessages(prev => [...prev, newMessage]);
            }
          });
          
          // Buscar mensagens recentes da API
          const response = await fetch('/api/chat');
          if (response.ok) {
            const recentMessages = await response.json();
            setMessages(recentMessages);
          }
          
          setConnected(true);
        } catch (error) {
          
          // Fallback para localStorage se falhar
          const savedMessages = loadChatMessages('global');
          if (savedMessages.length > 0) {
            setMessages(savedMessages);
          }
        }
      };
      
      initializeAbly();
      
      return () => {
        isMounted = false;
        if (channelRef.current) {
          channelRef.current.unsubscribe();
        }
      };
    }
  }, [isOpen, user]);
  
  // Load messages from localStorage como fallback
  useEffect(() => {
    if (isOpen && !connected) {
      const savedMessages = loadChatMessages('global');
      
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        // Initialize with mock data if no saved messages
        const mockMessages: Message[] = [
          {
            id: '1',
            content: 'Olá pessoal! Acabei de postar uma mentira boa sobre ter encontrado o Neymar no mercadinho!',
            sender: { id: 'user1', name: 'Carlos', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '2',
            content: 'Hahaha Carlos, você sempre inventa cada coisa! Vou lá curtir.',
            sender: { id: 'user2', name: 'Ana', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
            createdAt: new Date(Date.now() - 1800000).toISOString()
          },
          {
            id: '3',
            content: 'Pessoal, vocês viram minha postagem sobre ter sido abduzido? Já tem mais de 500 curtidas!',
            sender: { id: 'user3', name: 'Pedro', image: 'https://randomuser.me/api/portraits/men/23.jpg' },
            createdAt: new Date(Date.now() - 900000).toISOString()
          },
          {
            id: '4',
            content: 'Pedro, suas histórias de abdução sempre são as melhores! 👽',
            sender: { id: 'user4', name: 'Juliana', image: 'https://randomuser.me/api/portraits/women/12.jpg' },
            createdAt: new Date(Date.now() - 600000).toISOString()
          },
          {
            id: '5',
            content: 'Alguém tem dicas para criar histórias mais criativas? Estou sem inspiração.',
            sender: { id: 'user5', name: 'Rodrigo', image: 'https://randomuser.me/api/portraits/men/67.jpg' },
            createdAt: new Date(Date.now() - 300000).toISOString()
          }
        ];
        
        setMessages(mockMessages);
        saveChatMessages('global', mockMessages);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: { 
        id: user.id || 'guest', 
        name: user.display_name || 'Convidado',
        image: user.avatar
      },
      createdAt: new Date().toISOString()
    };
    
    try {
      if (channelRef.current && connected) {
        // Enviar mensagem via Ably
        await channelRef.current.publish('message', newMessage);
      } else {
        // Fallback para API se Ably não estiver conectado
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage)
        });
        
        if (response.ok) {
          setMessages(prev => [...prev, newMessage]);
        }
      }
    } catch (error) {
      
      // Salvar localmente como fallback
      setMessages(prev => [...prev, newMessage]);
    }
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveChatMessages('global', updatedMessages);
    setMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        aria-label="Abrir chat global"
      >
        <FaComment size={20} />
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-purple-600 text-white p-3 flex justify-between items-center">
        <h2 className="font-semibold">Chat Global</h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
      
      <div className="h-64 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-3">
            <div className="flex items-start">
              <img 
                src={msg.sender.image || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender.name}`} 
                alt={msg.sender.name} 
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-sm">{msg.sender.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{formatTime(msg.createdAt)}</span>
                </div>
                <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          disabled={!user}
        />
        <button
          type="button"
          className="bg-gray-100 text-gray-600 p-2 border-t border-r border-b rounded-none hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
        >
          <FaSmile />
        </button>
        <button
          type="submit"
          disabled={!message.trim() || !user}
          className="bg-purple-600 text-white p-2 rounded-r-md hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <FaPaperPlane />
        </button>
      </form>
      
      {!user && (
        <div className="p-2 text-center text-sm text-gray-500 bg-gray-100 dark:bg-gray-700">
          Faça login para participar do chat
        </div>
      )}
    </div>
  );
};

export default GlobalChat; 