import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ChatIcon, EyeIcon, SpeakerWaveIcon } from '../../utils/icons';
import { userApi } from '../../services/api';

interface MessageSettingsProps {
  currentUser: User;
}

const MessageSettings: React.FC<MessageSettingsProps> = ({ currentUser }) => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estados para configurações de mensagens
  const [allowMessages, setAllowMessages] = useState<string>('todos');
  const [messageNotifications, setMessageNotifications] = useState<boolean>(true);
  const [readReceipts, setReadReceipts] = useState<boolean>(true);
  const [showTypingIndicator, setShowTypingIndicator] = useState<boolean>(true);
  const [messageSounds, setMessageSounds] = useState<boolean>(true);
  const [autoDownloadMedia, setAutoDownloadMedia] = useState<boolean>(true);
  
  // Carregar configurações iniciais
  useEffect(() => {
    if (currentUser && currentUser.settings) {
      // Carregar configurações de mensagens se disponíveis
      if (currentUser.settings.messages) {
        setAllowMessages(currentUser.settings.messages.allowMessages || 'todos');
        setMessageNotifications(currentUser.settings.messages.notifications !== false);
        setReadReceipts(currentUser.settings.messages.readReceipts !== false);
        setShowTypingIndicator(currentUser.settings.messages.showTypingIndicator !== false);
        setMessageSounds(currentUser.settings.messages.messageSounds !== false);
        setAutoDownloadMedia(currentUser.settings.messages.autoDownloadMedia !== false);
      }
    }
  }, [currentUser]);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      // Preparar configurações de mensagens para salvar
      const messageSettings = {
        allowMessages: allowMessages,
        notifications: messageNotifications,
        readReceipts: readReceipts,
        showTypingIndicator: showTypingIndicator,
        messageSounds: messageSounds,
        autoDownloadMedia: autoDownloadMedia
      };
      
      // Chamar API para salvar configurações
      const apiResponse = await userApi.updateSettings(user.id, {
        messages: messageSettings
      });
      
      // Atualizar o usuário no contexto e localStorage
      if (apiResponse) {
        const mergedUser = { 
          ...user, 
          settings: {
            ...user.settings,
            messages: messageSettings
          }
        };
        
        setUser(mergedUser);
        localStorage.setItem('user', JSON.stringify(mergedUser));
        
        setMessage('Configurações salvas com sucesso!');
        
        // Limpar a mensagem após alguns segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      
      setMessage('Erro ao salvar as configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Configurações de Mensagens</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('Erro') 
          ? 'bg-red-100 text-red-700' 
          : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Permissões de Mensagens */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <ChatIcon className="h-5 w-5 mr-2" />
              Configurações de Privacidade de Mensagens
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Defina quem pode enviar mensagens para você
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                Quem pode enviar mensagens para mim
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha quem pode iniciar uma conversa com você
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="allow-messages-todos"
                    name="allow-messages"
                    type="radio"
                    checked={allowMessages === 'todos'}
                    onChange={() => setAllowMessages('todos')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="allow-messages-todos" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Todos (qualquer pessoa pode enviar mensagens)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="allow-messages-amigos"
                    name="allow-messages"
                    type="radio"
                    checked={allowMessages === 'amigos'}
                    onChange={() => setAllowMessages('amigos')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="allow-messages-amigos" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apenas amigos (somente pessoas que você segue)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="allow-messages-ninguem"
                    name="allow-messages"
                    type="radio"
                    checked={allowMessages === 'ninguem'}
                    onChange={() => setAllowMessages('ninguem')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="allow-messages-ninguem" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ninguém (desativar mensagens diretas)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preferências de Leitura */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              Preferências de Leitura
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Controle como suas interações com mensagens são vistas pelos outros
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="read-receipts"
                  name="read-receipts"
                  type="checkbox"
                  checked={readReceipts}
                  onChange={() => setReadReceipts(!readReceipts)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="read-receipts" className="font-medium text-gray-700 dark:text-gray-300">
                  Confirmações de leitura
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar para outras pessoas quando você leu as mensagens delas
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="typing-indicator"
                  name="typing-indicator"
                  type="checkbox"
                  checked={showTypingIndicator}
                  onChange={() => setShowTypingIndicator(!showTypingIndicator)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="typing-indicator" className="font-medium text-gray-700 dark:text-gray-300">
                  Indicador de digitação
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar para outras pessoas quando você está digitando
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notificações e Sons */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <SpeakerWaveIcon className="h-5 w-5 mr-2" />
              Notificações e Sons
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Configure como você é notificado sobre novas mensagens
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="message-notifications"
                  name="message-notifications"
                  type="checkbox"
                  checked={messageNotifications}
                  onChange={() => setMessageNotifications(!messageNotifications)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="message-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                  Notificações de novas mensagens
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Receber notificações quando novas mensagens chegarem
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="message-sounds"
                  name="message-sounds"
                  type="checkbox"
                  checked={messageSounds}
                  onChange={() => setMessageSounds(!messageSounds)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="message-sounds" className="font-medium text-gray-700 dark:text-gray-300">
                  Sons de mensagem
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Reproduzir sons quando novas mensagens chegarem
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="auto-download-media"
                  name="auto-download-media"
                  type="checkbox"
                  checked={autoDownloadMedia}
                  onChange={() => setAutoDownloadMedia(!autoDownloadMedia)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="auto-download-media" className="font-medium text-gray-700 dark:text-gray-300">
                  Download automático de mídia
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Baixar automaticamente fotos e vídeos recebidos nas mensagens
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </div>
    </div>
  );
};

export default MessageSettings; 