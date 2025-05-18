import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { UserGroupIcon, UserIcon } from '../../utils/icons';
import { userApi } from '../../services/api';

interface ConnectionSettingsProps {
  currentUser: User;
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({ currentUser }) => {
  const { setUser } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estados para configurações de seguidores
  const [followerSettings, setFollowerSettings] = useState<string>('todos');
  const [showFollowRequests, setShowFollowRequests] = useState<boolean>(true);
  const [allowMentions, setAllowMentions] = useState<boolean>(true);
  const [allowTags, setAllowTags] = useState<boolean>(true);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  
  // Carregar configurações iniciais
  useEffect(() => {
    if (currentUser && currentUser.settings) {
      // Carregar configurações de privacidade relacionadas a seguidores
      if (currentUser.settings.privacy) {
        setFollowerSettings(currentUser.settings.privacy.followSetting || 'todos');
        setShowFollowRequests(currentUser.settings.privacy.showFollowRequests !== false);
        setAllowMentions(currentUser.settings.privacy.allowMentions !== false);
        setAllowTags(currentUser.settings.privacy.allowTags !== false);
        setShowSuggestions(currentUser.settings.privacy.showSuggestions !== false);
      }
    }
  }, [currentUser]);
  
  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Construir objeto de configurações
      const connectionSettings = {
        privacy: {
          followSetting: followerSettings,
          showFollowRequests,
          allowMentions,
          allowTags,
          showSuggestions
        }
      };
      
      // Chamar API para salvar as configurações no servidor
      const response = await userApi.updateSettings(currentUser.id, connectionSettings);
      
      // Atualizar o objeto de usuário local
      const updatedUser = {
        ...currentUser,
        settings: {
          ...currentUser.settings,
          privacy: {
            ...currentUser.settings?.privacy,
            followSetting: followerSettings,
            showFollowRequests,
            allowMentions,
            allowTags,
            showSuggestions
          }
        }
      };
      
      // Atualizar o contexto global
      if (setUser) {
        setUser(updatedUser);
      }
      
      // Atualizar no localStorage
      const userJson = localStorage.getItem('userData');
      if (userJson) {
        const userData = JSON.parse(userJson);
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          settings: {
            ...userData.settings,
            privacy: {
              ...userData.settings?.privacy,
              followSetting: followerSettings,
              showFollowRequests,
              allowMentions,
              allowTags,
              showSuggestions
            }
          }
        }));
      }
      
      setMessage('Configurações de conexões atualizadas com sucesso!');
    } catch (error) {
      
      setMessage('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
      
      // Limpar mensagem após alguns segundos
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Configurações de Seguidores e Conexões</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('Erro') 
          ? 'bg-red-100 text-red-700' 
          : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Configurações de Seguidores */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Seguidores
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Controle quem pode te seguir e enviar solicitações de amizade
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                Quem pode me seguir
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha quem pode ver seu perfil e te seguir
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="follower-todos"
                    name="follower-setting"
                    type="radio"
                    checked={followerSettings === 'todos'}
                    onChange={() => setFollowerSettings('todos')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="follower-todos" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Todos (qualquer pessoa pode te seguir)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="follower-verificados"
                    name="follower-setting"
                    type="radio"
                    checked={followerSettings === 'verificados'}
                    onChange={() => setFollowerSettings('verificados')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="follower-verificados" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apenas usuários verificados
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="follower-aprovados"
                    name="follower-setting"
                    type="radio"
                    checked={followerSettings === 'aprovados'}
                    onChange={() => setFollowerSettings('aprovados')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="follower-aprovados" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apenas com aprovação (você precisará aprovar cada seguidor)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="show-follow-requests"
                  name="show-follow-requests"
                  type="checkbox"
                  checked={showFollowRequests}
                  onChange={() => setShowFollowRequests(!showFollowRequests)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="show-follow-requests" className="font-medium text-gray-700 dark:text-gray-300">
                  Exibir solicitações de seguidores
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar notificações de solicitações de novos seguidores
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Configurações de Menções e Tags */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Menções e Sugestões
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Controle como outras pessoas podem interagir com você
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="allow-mentions"
                  name="allow-mentions"
                  type="checkbox"
                  checked={allowMentions}
                  onChange={() => setAllowMentions(!allowMentions)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="allow-mentions" className="font-medium text-gray-700 dark:text-gray-300">
                  Permitir menções
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Permitir que outras pessoas mencionem você em posts e comentários (@seu_nome)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="allow-tags"
                  name="allow-tags"
                  type="checkbox"
                  checked={allowTags}
                  onChange={() => setAllowTags(!allowTags)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="allow-tags" className="font-medium text-gray-700 dark:text-gray-300">
                  Permitir tags em fotos
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Permitir que outras pessoas marquem você em fotos e vídeos
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="show-suggestions"
                  name="show-suggestions"
                  type="checkbox"
                  checked={showSuggestions}
                  onChange={() => setShowSuggestions(!showSuggestions)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="show-suggestions" className="font-medium text-gray-700 dark:text-gray-300">
                  Sugestões de amigos
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar sugestões de pessoas para seguir baseado nos seus interesses
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

export default ConnectionSettings; 