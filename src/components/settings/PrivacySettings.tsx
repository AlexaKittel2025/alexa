import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon } from '@heroicons/react/outline';
import LockClosedIcon from '@heroicons/react/outline/XIcon';
import UserGroupIcon from '@heroicons/react/outline/UserGroupIcon';
import * as userApi from '../../services/userApi';

interface PrivacySettingsProps {
  currentUser: User;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  activityVisibility: 'public' | 'followers' | 'private';
  allowMentions: boolean;
  showOnlineStatus: boolean;
  searchVisibility: 'public' | 'private';
  shareProfile: boolean;
  contentVisibility: 'public' | 'followers' | 'private';
  commentPermission: 'anyone' | 'followers' | 'none';
  showShare: boolean;
  tagPermission: 'anyone' | 'followers' | 'none';
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ currentUser }) => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Configurações de perfil
  const [profileVisibility, setProfileVisibility] = useState<PrivacySettings['profileVisibility']>('public');
  const [activityVisibility, setActivityVisibility] = useState<PrivacySettings['activityVisibility']>('followers');
  const [searchVisibility, setSearchVisibility] = useState<boolean>(true);
  const [shareProfile, setShareProfile] = useState<boolean>(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(true);
  
  // Configurações de conteúdo
  const [contentVisibility, setContentVisibility] = useState<PrivacySettings['contentVisibility']>('public');
  const [commentPermission, setCommentPermission] = useState<PrivacySettings['commentPermission']>('anyone');
  const [showShare, setShowShare] = useState<boolean>(true);
  const [tagPermission, setTagPermission] = useState<PrivacySettings['tagPermission']>('anyone');
  const [showMentions, setShowMentions] = useState<boolean>(true);
  
  // Carregar configurações iniciais do usuário
  useEffect(() => {
    if (currentUser?.settings?.privacy) {
      const privacy = currentUser.settings.privacy;
      setProfileVisibility(privacy.profileVisibility || 'public');
      setActivityVisibility(privacy.activityVisibility || 'followers');
      setShowOnlineStatus(privacy.showOnlineStatus !== false);
      setSearchVisibility(privacy.searchVisibility === 'public');
      setShareProfile(privacy.shareProfile !== false);
      setContentVisibility(privacy.contentVisibility || 'public');
      setCommentPermission(privacy.commentPermission || 'anyone');
      setShowShare(privacy.showShare !== false);
      setTagPermission(privacy.tagPermission || 'anyone');
      setShowMentions(privacy.allowMentions !== false);
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
      
      // Preparar configurações de privacidade para salvar
      const privacySettings: PrivacySettings = {
        profileVisibility,
        activityVisibility,
        allowMentions: showMentions,
        showOnlineStatus,
        searchVisibility: searchVisibility ? 'public' : 'private',
        shareProfile,
        contentVisibility,
        commentPermission,
        showShare,
        tagPermission
      };
      
      // Chamar API para salvar configurações
      const updatedUser = await userApi.updateSettings(user.id, {
        settings: {
          userId: user.id,
          privacy: privacySettings
        }
      });
      
      // Atualizar o usuário no contexto e localStorage
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Configurações salvas com sucesso!');
        
        // Limpar a mensagem após alguns segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de privacidade:', error);
      setMessage('Erro ao salvar as configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Configurações de Privacidade</h2>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md ${
          message.includes('sucesso')
            ? 'bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800'
            : 'bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800'
        }`}>
          {message}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Privacidade do perfil */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Privacidade do Perfil
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Controle quem pode ver suas informações pessoais
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quem pode ver seu perfil?
              </label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center">
                  <input
                    id="profile-public"
                    name="profile-visibility"
                    type="radio"
                    checked={profileVisibility === 'public'}
                    onChange={() => setProfileVisibility('public')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="profile-public" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Todos (Público)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="profile-followers"
                    name="profile-visibility"
                    type="radio"
                    checked={profileVisibility === 'followers'}
                    onChange={() => setProfileVisibility('followers')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="profile-followers" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Apenas seguidores
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="profile-private"
                    name="profile-visibility"
                    type="radio"
                    checked={profileVisibility === 'private'}
                    onChange={() => setProfileVisibility('private')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="profile-private" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Privado (apenas você)
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Visibilidade das suas atividades
              </label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center">
                  <input
                    id="activity-public"
                    name="activity-visibility"
                    type="radio"
                    checked={activityVisibility === 'public'}
                    onChange={() => setActivityVisibility('public')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="activity-public" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Todos podem ver suas atividades
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="activity-followers"
                    name="activity-visibility"
                    type="radio"
                    checked={activityVisibility === 'followers'}
                    onChange={() => setActivityVisibility('followers')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="activity-followers" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Apenas seguidores
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="activity-private"
                    name="activity-visibility"
                    type="radio"
                    checked={activityVisibility === 'private'}
                    onChange={() => setActivityVisibility('private')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="activity-private" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Ninguém pode ver suas atividades
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="search-visibility" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Permitir que me encontrem por busca
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quando desativado, seu perfil não aparecerá nos resultados de busca
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="search-visibility"
                      checked={searchVisibility}
                      onChange={() => setSearchVisibility(!searchVisibility)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="share-profile" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Permitir compartilhamento do perfil
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Outros usuários poderão compartilhar seu perfil
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="share-profile"
                      checked={shareProfile}
                      onChange={() => setShareProfile(!shareProfile)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="online-status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mostrar status online
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Outros usuários poderão ver quando você está online
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="online-status"
                      checked={showOnlineStatus}
                      onChange={() => setShowOnlineStatus(!showOnlineStatus)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacidade do conteúdo */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Privacidade do Conteúdo
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Controle quem pode interagir com seu conteúdo
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quem pode ver suas postagens?
              </label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center">
                  <input
                    id="content-public"
                    name="content-visibility"
                    type="radio"
                    checked={contentVisibility === 'public'}
                    onChange={() => setContentVisibility('public')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="content-public" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Todos (Público)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="content-followers"
                    name="content-visibility"
                    type="radio"
                    checked={contentVisibility === 'followers'}
                    onChange={() => setContentVisibility('followers')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="content-followers" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Apenas seguidores
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="content-private"
                    name="content-visibility"
                    type="radio"
                    checked={contentVisibility === 'private'}
                    onChange={() => setContentVisibility('private')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="content-private" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Privado (apenas você)
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quem pode comentar em suas postagens?
              </label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center">
                  <input
                    id="comment-anyone"
                    name="comment-permission"
                    type="radio"
                    checked={commentPermission === 'anyone'}
                    onChange={() => setCommentPermission('anyone')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="comment-anyone" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Qualquer pessoa
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="comment-followers"
                    name="comment-permission"
                    type="radio"
                    checked={commentPermission === 'followers'}
                    onChange={() => setCommentPermission('followers')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="comment-followers" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Apenas seguidores
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="comment-none"
                    name="comment-permission"
                    type="radio"
                    checked={commentPermission === 'none'}
                    onChange={() => setCommentPermission('none')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="comment-none" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Ninguém
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quem pode marcar você em postagens?
              </label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center">
                  <input
                    id="tag-anyone"
                    name="tag-permission"
                    type="radio"
                    checked={tagPermission === 'anyone'}
                    onChange={() => setTagPermission('anyone')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="tag-anyone" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Qualquer pessoa
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="tag-followers"
                    name="tag-permission"
                    type="radio"
                    checked={tagPermission === 'followers'}
                    onChange={() => setTagPermission('followers')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="tag-followers" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Apenas seguidores
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="tag-none"
                    name="tag-permission"
                    type="radio"
                    checked={tagPermission === 'none'}
                    onChange={() => setTagPermission('none')}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="tag-none" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                    Ninguém
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="show-share" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Permitir compartilhamento de postagens
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Outros usuários poderão compartilhar suas postagens
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="show-share"
                      checked={showShare}
                      onChange={() => setShowShare(!showShare)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="show-mentions" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Permitir menções
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Outros usuários poderão mencionar você em postagens e comentários
                  </p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="show-mentions"
                      checked={showMentions}
                      onChange={() => setShowMentions(!showMentions)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings; 