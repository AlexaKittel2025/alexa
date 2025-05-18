import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  ClockIcon, 
  TagIcon, 
  HeartIcon, 
  ChatAlt2Icon,
  LocationMarkerIcon,
  SearchIcon
} from '../../utils/icons';
import { userApi } from '../../services/api';

interface ActivitySettingsProps {
  currentUser: User;
}

const ActivitySettings: React.FC<ActivitySettingsProps> = ({ currentUser }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estados para configurações de atividade
  const [activityVisibility, setActivityVisibility] = useState<string>('todos');
  const [showLocation, setShowLocation] = useState<boolean>(true);
  const [showPostLikes, setShowPostLikes] = useState<boolean>(true);
  const [showComments, setShowComments] = useState<boolean>(true);
  const [showSearches, setShowSearches] = useState<boolean>(true);
  
  // Carregar configurações iniciais
  useEffect(() => {
    if (currentUser) {
      // Carregar configurações de privacidade relacionadas a atividade
      setActivityVisibility('todos');
      setShowLocation(true);
      setShowPostLikes(true);
      setShowComments(true);
      setShowSearches(true);
    }
  }, [currentUser]);

  const viewActivity = (activityType: string) => {
    setMessage(`Redirecionando para o log de ${activityType}...`);
    
    // Limpar a mensagem após alguns segundos
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      // Preparar configurações de atividade para salvar
      const activitySettings = {
        saveSearchHistory: showSearches,
        saveLocationHistory: showLocation,
        saveViewedStories: showPostLikes,
        saveNavigation: showComments
      };
      
      // Chamar API para salvar configurações
      const updatedUser = await userApi.updateSettings(user.id, {
        activity: activitySettings
      });
      
      // Atualizar o usuário no localStorage
      if (updatedUser) {
        const mergedUser = { 
          ...user, 
          settings: {
            ...user.settings,
            activity: activitySettings
          }
        };
        
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
      <h2 className="text-2xl font-bold mb-6">Configurações de Atividade</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('Erro') 
          ? 'bg-red-100 text-red-700' 
          : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Visibilidade de Atividade */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              Visibilidade do Histórico de Atividade
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Controle quem pode ver seu histórico de atividades na plataforma
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                Quem pode ver minha atividade
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha quem pode acompanhar suas ações na plataforma
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="visibility-todos"
                    name="visibility-option"
                    type="radio"
                    checked={activityVisibility === 'todos'}
                    onChange={() => setActivityVisibility('todos')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="visibility-todos" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Todos (qualquer pessoa pode ver sua atividade)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="visibility-amigos"
                    name="visibility-option"
                    type="radio"
                    checked={activityVisibility === 'amigos'}
                    onChange={() => setActivityVisibility('amigos')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="visibility-amigos" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apenas amigos (somente pessoas que você segue ou que te seguem)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="visibility-ninguem"
                    name="visibility-option"
                    type="radio"
                    checked={activityVisibility === 'ninguem'}
                    onChange={() => setActivityVisibility('ninguem')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="visibility-ninguem" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ninguém (sua atividade será privada)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tipos de Atividade */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <TagIcon className="h-5 w-5 mr-2" />
              Tipos de Atividade Visíveis
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Escolha quais tipos de atividade serão exibidos no seu histórico
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="show-location"
                  name="show-location"
                  type="checkbox"
                  checked={showLocation}
                  onChange={() => setShowLocation(!showLocation)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="show-location" className="font-medium text-gray-700 dark:text-gray-300">
                  Localizações
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar quando você marcar uma localização em posts
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="show-post-likes"
                  name="show-post-likes"
                  type="checkbox"
                  checked={showPostLikes}
                  onChange={() => setShowPostLikes(!showPostLikes)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="show-post-likes" className="font-medium text-gray-700 dark:text-gray-300">
                  Curtidas
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar quando você curtir posts ou comentários
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="show-comments"
                  name="show-comments"
                  type="checkbox"
                  checked={showComments}
                  onChange={() => setShowComments(!showComments)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="show-comments" className="font-medium text-gray-700 dark:text-gray-300">
                  Comentários
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar quando você comentar em posts
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="show-searches"
                  name="show-searches"
                  type="checkbox"
                  checked={showSearches}
                  onChange={() => setShowSearches(!showSearches)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="show-searches" className="font-medium text-gray-700 dark:text-gray-300">
                  Pesquisas
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar quando você pesquisar por usuários ou assuntos
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

export default ActivitySettings; 