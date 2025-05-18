;

;
import { ExclamationIcon } from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { User, UserSettings } from '../../types';
import { useAuth } from '../../context/AuthContext';import * as userApi from '../../services/userApi';

interface SecuritySettingsProps {
  currentUser: User;
}

interface BlockedUser {
  id: string;
  username: string;
  displayName?: string;
  photoURL?: string;
}

interface SecuritySettings {
  blockedUsers: string[];
  reportedUsers: string[];
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  allowAccountRecovery: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ currentUser }) => {
  const { logout, setUser } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [reportedUsers, setReportedUsers] = useState<string[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [loginNotifications, setLoginNotifications] = useState<boolean>(true);
  const [allowAccountRecovery, setAllowAccountRecovery] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportType, setReportType] = useState('account');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Carregar configurações iniciais
  useEffect(() => {
    if (currentUser && currentUser.settings?.security) {
      const security = currentUser.settings.security;
      setBlockedUsers(security.blockedUsers || []);
      setReportedUsers(security.reportedUsers || []);
      setTwoFactorEnabled(security.twoFactorEnabled || false);
      setLoginNotifications(security.loginNotifications !== false);
      setAllowAccountRecovery(security.allowAccountRecovery !== false);
    }
  }, [currentUser]);

  const handleAction = async (action: string, target?: string) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      if (!currentUser?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      let successMessage = '';
      let securitySettings: Partial<SecuritySettings> = {};
      
      switch (action) {
        case 'report':
          successMessage = 'Conta reportada. Nossa equipe irá analisar o caso.';
          securitySettings = {
            reportedUsers: [...(currentUser.settings?.security?.reportedUsers || []), target]
          };
          break;
        
        case 'block':
          successMessage = 'Conta bloqueada com sucesso.';
          securitySettings = {
            blockedUsers: [...(currentUser.settings?.security?.blockedUsers || []), target]
          };
          break;
        
        case 'unblock':
          const blockedUsers = currentUser.settings?.security?.blockedUsers || [];
          successMessage = 'Conta desbloqueada com sucesso.';
          securitySettings = {
            blockedUsers: blockedUsers.filter(account => account !== target)
          };
          break;
        
        default:
          throw new Error('Ação inválida');
      }
      
      // Chamar API para salvar configurações
      const updatedUser = await userApi.updateSettings(currentUser.id, {
        settings: {
          userId: currentUser.id,
          security: securitySettings
        }
      });
      
      // Atualizar o usuário no contexto e localStorage
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage(successMessage);
        
        // Limpar a mensagem após alguns segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      
      setMessage('Erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      if (!currentUser?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      // Construir objeto de configurações
      const securitySettings: SecuritySettings = {
        blockedUsers,
        reportedUsers,
        twoFactorEnabled,
        loginNotifications,
        allowAccountRecovery
      };
      
      // Chamar API para salvar as configurações
      const updatedUser = await userApi.updateSettings(currentUser.id, {
        settings: {
          userId: currentUser.id,
          security: securitySettings
        }
      });
      
      // Atualizar o usuário no contexto e localStorage
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Configurações de segurança atualizadas com sucesso!');
        
        // Limpar a mensagem após alguns segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      
      setMessage('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para lidar com bloqueio/desbloqueio de usuários
  const handleToggleBlockUser = (userId: string) => {
    if (blockedUsers.includes(userId)) {
      setBlockedUsers(blockedUsers.filter(id => id !== userId));
    } else {
      setBlockedUsers([...blockedUsers, userId]);
    }
  };
  
  // Função para lidar com deleção de conta
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    try {
      // Em uma implementação real, chamaríamos a API
      // const response = await userApi.deleteAccount(currentUser.id, { reason: deleteReason });
      
      // Simulação para ambiente de desenvolvimento
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Limpar local storage e redirecionar para página de login
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      
      // Normalmente redirecionaríamos para uma página de confirmação
      // window.location.href = '/account-deleted';
      
      // Para esta simulação, apenas exibimos uma mensagem
      setMessage('Sua conta foi marcada para exclusão. Você será redirecionado em breve.');
      
      setTimeout(() => {
        if (setUser) {
          setUser(null);
        }
        // window.location.href = '/login';
      }, 3000);
      
    } catch (error) {
      
      setMessage('Erro ao excluir conta. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Segurança da Conta</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('Erro') 
          ? 'bg-red-100 text-red-700' 
          : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Reportar Contas */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <ExclamationIcon className="h-5 w-5 mr-2" />
              Reportar Contas
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Reporte contas que violem os termos de serviço
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Se você encontrar uma conta que viole nossos termos de serviço, por favor, reporte para que possamos investigar.
            </p>
            
            {reportedUsers.length > 0 ? (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Contas reportadas:</h4>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                  {reportedUsers.map((userId, index) => (
                    <li key={index}>Usuário {userId} - <span className="text-orange-600">Em análise</span></li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Você não reportou nenhuma conta ainda.
              </p>
            )}
            
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reportar uma conta
            </button>
          </div>
        </div>
        
        {/* Usuários Bloqueados */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <XCircleIcon className="h-5 w-5 mr-2" />
              Usuários Bloqueados
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Gerencie usuários que você bloqueou
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {blockedUsers.length > 0 ? (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Usuários bloqueados:</h4>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {blockedUsers.map((userId, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Usuário {userId}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleBlockUser(userId)}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Desbloquear
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Você não bloqueou nenhum usuário ainda.
              </p>
            )}
            
            <div className="mt-4">
              <label htmlFor="block-user" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bloquear um usuário
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="block-user"
                  id="block-user"
                  className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Nome do usuário"
                />
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Bloquear
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Configurações de Autenticação */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Configurações de Autenticação
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Gerencie como você se autentica na plataforma
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="two-factor"
                  name="two-factor"
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="two-factor" className="font-medium text-gray-700 dark:text-gray-300">
                  Autenticação de dois fatores
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Adicione uma camada extra de segurança requerendo um código enviado ao seu telefone
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="login-notifications"
                  name="login-notifications"
                  type="checkbox"
                  checked={loginNotifications}
                  onChange={() => setLoginNotifications(!loginNotifications)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="login-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                  Notificações de login
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Receba notificações quando sua conta for acessada de um novo dispositivo
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="account-recovery"
                  name="account-recovery"
                  type="checkbox"
                  checked={allowAccountRecovery}
                  onChange={() => setAllowAccountRecovery(!allowAccountRecovery)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="account-recovery" className="font-medium text-gray-700 dark:text-gray-300">
                  Permitir recuperação de conta
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Permitir recuperar sua conta caso você esqueça sua senha
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exclusão de Conta */}
        <div className="bg-red-50 dark:bg-red-900/20 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-red-200 dark:border-red-800">
            <h3 className="text-lg font-medium leading-6 text-red-800 dark:text-red-400 flex items-center">
              Exclusão de Conta
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-red-600 dark:text-red-300">
              Cuidado: esta ação não pode ser desfeita
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <p className="text-red-700 dark:text-red-300 mb-4">
              Ao excluir sua conta, todos os seus dados serão removidos permanentemente e você não poderá recuperá-los.
            </p>
            
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Excluir minha conta
              </button>
            ) : (
              <div className="space-y-4">
                <p className="font-medium text-red-700 dark:text-red-300">
                  Por favor, confirme que deseja excluir sua conta:
                </p>
                
                <div>
                  <label htmlFor="delete-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Motivo da exclusão (opcional)
                  </label>
                  <textarea
                    id="delete-reason"
                    name="delete-reason"
                    rows={3}
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
                    placeholder="Conte-nos por que está excluindo sua conta..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                  >
                    {isLoading ? 'Processando...' : 'Confirmar exclusão'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
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

export default SecuritySettings; 