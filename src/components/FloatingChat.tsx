import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { XIcon, EmojiHappyIcon, PhotographIcon, PaperAirplaneIcon } from '@heroicons/react/outline';

interface FloatingChatProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  customMode?: 'modal' | 'floating';
}

const FloatingChat: React.FC<FloatingChatProps> = ({ isOpen, onClose, user, customMode = 'floating' }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{id: string; text: string; sender: 'user' | 'me'; timestamp: Date}[]>([
    {
      id: '1',
      text: `Olá! Estou disponível para conversar.`,
      sender: 'user',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Adicionar mensagem do usuário atual
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      timestamp: new Date()
    }]);
    
    setMessage('');
    
    // Simular resposta após um pequeno delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Vou responder em breve.',
        sender: 'user',
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!isOpen) return null;

  // Componente de chat que será renderizado tanto no modo flutuante quanto modal
  const ChatContent = () => (
    <>
      {/* Cabeçalho do chat */}
      <div className="bg-primary p-3 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src={user.photoURL || "https://via.placeholder.com/40"} 
            alt={user.displayName}
            className="w-8 h-8 rounded-full object-cover" 
          />
          <div>
            <h3 className="font-medium text-sm">{user.displayName}</h3>
            <p className="text-xs opacity-80">@{user.username}</p>
          </div>
        </div>
        <button 
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
          onClick={onClose}
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-2 px-3 ${
                msg.sender === 'me' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Área de input */}
      <div className="p-3 border-t dark:border-gray-700 flex items-center gap-2">
        <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full">
          <EmojiHappyIcon className="h-5 w-5" />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full">
          <PhotographIcon className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          className="p-2 bg-primary text-white rounded-full hover:bg-opacity-90"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
  
  // Renderização condicional baseada no modo
  if (customMode === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-80 md:w-96 h-[60vh] max-h-[500px] flex flex-col">
          <ChatContent />
        </div>
      </div>
    );
  }
  
  // Modo padrão flutuante
  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 flex flex-col h-[60vh] max-h-[500px]">
      <ChatContent />
    </div>
  );
};

export default FloatingChat; 