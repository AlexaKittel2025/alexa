'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaSignInAlt, FaPaperPlane, FaSmile } from 'react-icons/fa';

type Message = {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
};

export default function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'Sistema', text: 'Bem-vindo ao chat da Mentei!', timestamp: new Date() },
    { id: '2', user: 'Sistema', text: 'Digite seu nome para participar.', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar nome de convidado do localStorage se existir
    const savedName = localStorage.getItem('guestName');
    if (savedName) {
      setGuestName(savedName);
    }
    
    // Rolar para o final quando as mensagens mudarem
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    if (!guestName.trim()) {
      alert('Por favor, digite seu nome para participar do chat.');
      return;
    }

    // Adicionar nova mensagem à lista
    const newMessage: Message = {
      id: Date.now().toString(),
      user: guestName,
      text: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Salvar nome do convidado
    localStorage.setItem('guestName', guestName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-purple-600 text-white">
        <h2 className="text-lg font-bold">Chat Global</h2>
      </div>
      
      <div className="h-80 overflow-y-auto p-4 bg-gray-50">
        {messages.map(message => (
          <div key={message.id} className="mb-4 flex">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                <FaUser className="text-purple-700" />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {message.user}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800 mt-1 break-words">
                {message.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        {!guestName && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Seu nome (opcional)"
              className="w-full p-2 border rounded-lg mb-2"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Digite seu nome para participar</span>
              <Link href="/login" className="text-purple-600 hover:underline flex items-center">
                <FaSignInAlt className="mr-1" /> Entrar com sua conta
              </Link>
            </div>
          </div>
        )}
        
        <div className="relative">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="w-full p-3 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!guestName}
          />
          <div className="absolute right-2 top-2 flex">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-100"
            >
              <FaSmile />
            </button>
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !guestName}
              className="p-2 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-100 disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 