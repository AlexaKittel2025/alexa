import React, { useState } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import * as userApi from '../../services/userApi';

interface AccountSettingsProps {
  currentUser: User;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ currentUser }) => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    
    setMessage(null);
    setError(null);
    setIsUpdating(true);
    
    try {
      const passwordData: PasswordChangeData = {
        currentPassword,
        newPassword
      };
      
      // Chamar API para atualizar a senha
      await userApi.updatePassword(user.id, passwordData);
      
      setMessage('Senha atualizada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Limpar a mensagem após alguns segundos
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      
      setError('Erro ao atualizar senha. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeactivateAccount = async () => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }
    
    const confirmation = window.confirm(
      'Tem certeza que deseja desativar sua conta? Todos os seus dados serão preservados, mas seu perfil ficará invisível para outros usuários até que você faça login novamente.'
    );
    
    if (confirmation) {
      setIsUpdating(true);
      setMessage(null);
      setError(null);
      
      try {
        // Chamar API para desativar a conta
        await userApi.deactivateAccount(user.id);
        
        setMessage('Conta desativada com sucesso. Você será redirecionado para a página inicial em alguns segundos.');
        
        // Redirecionar após alguns segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } catch (error) {
        
        setError('Erro ao desativar conta. Tente novamente.');
      } finally {
        setIsUpdating(false);
      }
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }
    
    const confirmation = window.confirm(
      'ATENÇÃO: Esta ação não pode ser desfeita. Todos os seus dados, postagens e interações serão permanentemente excluídos. Tem certeza que deseja prosseguir?'
    );
    
    if (confirmation) {
      const doubleConfirmation = window.confirm(
        'Esta é sua última chance. Ao confirmar, sua conta será PERMANENTEMENTE EXCLUÍDA. Deseja continuar?'
      );
      
      if (doubleConfirmation) {
        setIsUpdating(true);
        setMessage(null);
        setError(null);
        
        try {
          // Chamar API para excluir a conta
          await userApi.deleteAccount(user.id);
          
          setMessage('Conta excluída com sucesso. Você será redirecionado para a página inicial em alguns segundos.');
          
          // Redirecionar após alguns segundos
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } catch (error) {
          
          setError('Erro ao excluir conta. Tente novamente.');
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };
  
  return (
    <div className="px-4 py-5 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Configurações de Conta
      </h1>
      
      {message && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
          {message}
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          {error}
        </div>
      )}
      
      <div className="mt-6 space-y-8">
        {/* Seção de Alteração de Senha */}
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Segurança da Conta
            </h2>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Alterar Senha</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              <p>
                Escolha uma senha forte e única que você não usa em outros sites.
              </p>
            </div>
            
            <form className="mt-5 sm:flex sm:flex-col sm:items-start" onSubmit={handlePasswordChange}>
              <div className="w-full sm:max-w-md space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Senha Atual
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="current-password"
                      id="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nova Senha
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="new-password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmar Nova Senha
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="mt-5 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isUpdating}
              >
                {isUpdating ? 'Atualizando...' : 'Atualizar Senha'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Seção de Gerenciamento de Conta */}
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Gerenciamento de Conta
            </h2>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Desativar Conta</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    Ao desativar sua conta, seu perfil ficará invisível para outros usuários.
                    Você pode reativar sua conta a qualquer momento fazendo login novamente.
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleDeactivateAccount}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:text-sm"
                  >
                    {isUpdating ? 'Desativando...' : 'Desativar Conta'}
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-red-700">Excluir Conta</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    Uma vez que você exclua sua conta, não há volta.
                    Por favor, tenha certeza.
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                  >
                    {isUpdating ? 'Excluindo...' : 'Excluir Conta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 