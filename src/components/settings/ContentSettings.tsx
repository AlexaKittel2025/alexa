import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CheckIcon, EyeIcon, ExclamationIcon, DocumentTextIcon } from '../../utils/icons';
import { userApi } from '../../services/api';

interface ContentSettingsProps {
  currentUser: User;
}

const ContentSettings: React.FC<ContentSettingsProps> = ({ currentUser }) => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Configurações de conteúdo para adultos
  const [adultContent, setAdultContent] = useState<boolean>(false);
  const [violentContent, setViolentContent] = useState<boolean>(false);
  const [sensitiveContent, setSensitiveContent] = useState<boolean>(false);
  
  // Configurações de feed e qualidade
  const [qualityFilter, setQualityFilter] = useState<string>('low');
  const [feedPreference, setFeedPreference] = useState<string>('mixed');
  const [autoplayVideos, setAutoplayVideos] = useState<boolean>(true);
  const [loadHDImages, setLoadHDImages] = useState<boolean>(true);
  
  // Carregar configurações iniciais
  useEffect(() => {
    if (currentUser && currentUser.settings) {
      // Carregar configurações de conteúdo se disponíveis
      if (currentUser.settings.contentPreferences) {
        setAdultContent(currentUser.settings.contentPreferences.adultContent);
        setViolentContent(currentUser.settings.contentPreferences.violentContent);
        setSensitiveContent(currentUser.settings.contentPreferences.sensitiveContent);
      }
    }
  }, [currentUser]);
  
  // Função para salvar configurações
  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      // Preparar configurações de conteúdo para salvar
      const contentSettings = {
        contentPreferences: {
          showAdultContent: adultContent,
          showSensitiveContent: sensitiveContent,
          tagFilters: [],
          contentLanguage: 'pt-BR',
          autoTranslate: false
        },
        feedSettings: {
          sortBy: 'recent',
          preferredCategories: []
        }
      };
      
      // Chamar API para salvar configurações
      const apiResponse = await userApi.updateSettings(user.id, {
        content: contentSettings
      });
      
      // Atualizar o usuário no contexto e localStorage
      if (apiResponse) {
        const mergedUser = { 
          ...user, 
          settings: {
            ...user.settings,
            content: contentSettings
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
      <h2 className="text-2xl font-bold mb-6">Configurações de Conteúdo</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('Erro') 
          ? 'bg-red-100 text-red-700' 
          : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Configurações de Conteúdo Sensível */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Visualização de Conteúdo Sensível
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Controle que tipo de conteúdo sensível você quer ver
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="adult-content"
                  name="adult-content"
                  type="checkbox"
                  checked={adultContent}
                  onChange={() => setAdultContent(!adultContent)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="adult-content" className="font-medium text-gray-700 dark:text-gray-300">
                  Conteúdo para adultos
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar conteúdo classificado para maiores de 18 anos
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="violent-content"
                  name="violent-content"
                  type="checkbox"
                  checked={violentContent}
                  onChange={() => setViolentContent(!violentContent)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="violent-content" className="font-medium text-gray-700 dark:text-gray-300">
                  Conteúdo violento
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar conteúdo que possa conter violência ou sangue
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="sensitive-content"
                  name="sensitive-content"
                  type="checkbox"
                  checked={sensitiveContent}
                  onChange={() => setSensitiveContent(!sensitiveContent)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="sensitive-content" className="font-medium text-gray-700 dark:text-gray-300">
                  Outros conteúdos sensíveis
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar conteúdo potencialmente perturbador ou polêmico
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filtro de Feed */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Configurações de Feed
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Personalize como o conteúdo aparece em seu feed
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                Filtro de qualidade
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha o nível de filtro para manter seu feed com conteúdo de qualidade
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="quality-high"
                    name="quality-filter"
                    type="radio"
                    checked={qualityFilter === 'high'}
                    onChange={() => setQualityFilter('high')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="quality-high" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alto (mostrar apenas conteúdo de alta qualidade)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="quality-medium"
                    name="quality-filter"
                    type="radio"
                    checked={qualityFilter === 'medium'}
                    onChange={() => setQualityFilter('medium')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="quality-medium" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Médio (filtrar apenas conteúdo de baixa qualidade)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="quality-low"
                    name="quality-filter"
                    type="radio"
                    checked={qualityFilter === 'low'}
                    onChange={() => setQualityFilter('low')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="quality-low" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Baixo (mostrar todo tipo de conteúdo)
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                Preferência de feed
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha se prefere ver conteúdo mais recente ou mais relevante
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="feed-recent"
                    name="feed-preference"
                    type="radio"
                    checked={feedPreference === 'recent'}
                    onChange={() => setFeedPreference('recent')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="feed-recent" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mais recente (mostrar posts em ordem cronológica)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="feed-relevant"
                    name="feed-preference"
                    type="radio"
                    checked={feedPreference === 'relevant'}
                    onChange={() => setFeedPreference('relevant')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="feed-relevant" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mais relevante (mostrar primeiro conteúdo que você pode gostar mais)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="feed-mixed"
                    name="feed-preference"
                    type="radio"
                    checked={feedPreference === 'mixed'}
                    onChange={() => setFeedPreference('mixed')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="feed-mixed" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Misto (combinação balanceada de recentes e relevantes)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="autoplay-videos"
                  name="autoplay-videos"
                  type="checkbox"
                  checked={autoplayVideos}
                  onChange={() => setAutoplayVideos(!autoplayVideos)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="autoplay-videos" className="font-medium text-gray-700 dark:text-gray-300">
                  Reproduzir vídeos automaticamente
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Iniciar reprodução de vídeos enquanto você navega
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="load-hd-images"
                  name="load-hd-images"
                  type="checkbox"
                  checked={loadHDImages}
                  onChange={() => setLoadHDImages(!loadHDImages)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="load-hd-images" className="font-medium text-gray-700 dark:text-gray-300">
                  Carregar imagens em alta definição
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Mostrar imagens em melhor qualidade (pode consumir mais dados)
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

export default ContentSettings; 