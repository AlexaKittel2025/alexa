'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUsers, FaGlobe, FaSmile, FaEllipsisV, FaCircle } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
  createdAt: string;
  sender: User;
}

interface OnlineUser {
  id: string;
  username: string;
  display_name: string;
  image: string | null;
  lastSeen: string;
}

export default function GlobalChatV2() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({ totalMessages: 0, todayMessages: 0, onlineUsers: 0 });
  
  const { user } = useCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<Ably.Types.RealtimeChannelPromise | null>(null);

  // Emojis populares
  const popularEmojis = ['😀', '😂', '❤️', '👍', '🔥', '🎉', '😎', '🤔', '😱', '💯'];

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Conectar ao Ably e carregar mensagens
  useEffect(() => {
    loadMessages();
    loadOnlineUsers();
    loadStats();
    
    // Conectar ao Ably para real-time
    const initializeAbly = async () => {
      try {
        const ably = getAblyClient();
        const channel = ably.channels.get('chat:global');
        channelRef.current = channel;

        // Inscrever-se para receber mensagens
        await channel.subscribe('message', (message: Ably.Types.Message) => {
          const newMessage = message.data as Message;
          setMessages(prev => [...prev, newMessage]);
        });

        // Escutar mudanças de presença
        channel.presence.subscribe('enter', () => {
          loadOnlineUsers();
        });

        channel.presence.subscribe('leave', () => {
          loadOnlineUsers();
        });

        // Entrar no canal
        if (user) {
          await channel.presence.enter({
            userId: user.id,
            username: user.username || user.display_name,
            timestamp: new Date().toISOString()
          });
        }

        setConnected(true);
      } catch (error) {
        console.error('Erro ao conectar ao Ably:', error);
        setConnected(false);
      }
    };

    initializeAbly();

    // Atualizar dados periodicamente
    const interval = setInterval(() => {
      loadOnlineUsers();
      loadStats();
    }, 30000); // 30 segundos

    return () => {
      clearInterval(interval);
      if (channelRef.current && user) {
        channelRef.current.presence.leave();
        channelRef.current.unsubscribe();
      }
    };
  }, [user]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat/global');
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const response = await fetch('/api/chat/global/online');
      
      if (response.ok) {
        const data = await response.json();
        setOnlineUsers(data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários online:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/chat/global/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      setSending(true);
      const response = await fetch('/api/chat/global', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage
        }),
      });

      if (response.ok) {
        const message = await response.json();
        
        // Publicar mensagem em tempo real
        if (channelRef.current && connected) {
          await channelRef.current.publish('message', message);
        }
        
        setNewMessage('');
        setShowEmojiPicker(false);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      {/* Lista de usuários online (desktop) */}
      <div className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Usuários Online ({onlineUsers.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {onlineUsers.map(onlineUser => (
              <div key={onlineUser.id} className="flex items-center gap-3">
                <div className="relative">
                  {onlineUser.image ? (
                    <img
                      src={onlineUser.image}
                      alt={onlineUser.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center text-sm font-medium">
                      {onlineUser.display_name[0].toUpperCase()}
                    </div>
                  )}
                  <FaCircle className="absolute -bottom-0.5 -right-0.5 text-green-500 text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {onlineUser.display_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{onlineUser.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="p-4 space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Estatísticas</h4>
          <div className="text-sm space-y-1">
            <p className="text-gray-600 dark:text-gray-400">
              Mensagens hoje: <span className="font-medium">{stats.todayMessages}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Total de mensagens: <span className="font-medium">{stats.totalMessages}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Usuários online: <span className="font-medium">{stats.onlineUsers}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Área do chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaGlobe className="text-purple-600 text-xl" />
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Chat Global</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.onlineUsers} usuários online
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlineUsers(!showOnlineUsers)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <FaUsers className="text-gray-600 dark:text-gray-400" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <FaEllipsisV className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Status de conexão */}
        {!connected && (
          <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm">
            Conectando ao chat em tempo real...
          </div>
        )}

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FaGlobe className="text-4xl mb-3" />
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm">Seja o primeiro a conversar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className="flex gap-3 group">
                  {message.sender.image ? (
                    <img
                      src={message.sender.image}
                      alt={message.sender.display_name}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center flex-shrink-0">
                      <span className="font-medium">
                        {message.sender.display_name[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {message.sender.display_name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        @{message.sender.username}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        · {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-white break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input de mensagem */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {popularEmojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <FaSmile />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={user ? "Digite uma mensagem..." : "Faça login para participar"}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={!user || sending}
            />
            
            <button
              type="submit"
              disabled={!user || sending || !newMessage.trim()}
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>

      {/* Lista de usuários online (mobile) */}
      {showOnlineUsers && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold">Usuários Online ({onlineUsers.length})</h3>
              <button
                onClick={() => setShowOnlineUsers(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-5rem)]">
              {onlineUsers.map(onlineUser => (
                <div key={onlineUser.id} className="flex items-center gap-3">
                  <div className="relative">
                    {onlineUser.image ? (
                      <img
                        src={onlineUser.image}
                        alt={onlineUser.display_name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center text-sm font-medium">
                        {onlineUser.display_name[0].toUpperCase()}
                      </div>
                    )}
                    <FaCircle className="absolute -bottom-0.5 -right-0.5 text-green-500 text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{onlineUser.display_name}</p>
                    <p className="text-xs text-gray-500">@{onlineUser.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}