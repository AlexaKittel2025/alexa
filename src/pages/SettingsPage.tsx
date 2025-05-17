import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// Componentes para cada seção de configuração
import ProfileSettings from '../components/settings/ProfileSettings';
import AccountSettings from '../components/settings/AccountSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import PrivacySettings from '../components/settings/PrivacySettings';
import ThemeSettings from '../components/settings/ThemeSettings';
import ContentSettings from '../components/settings/ContentSettings';
import ConnectionSettings from '../components/settings/ConnectionSettings';
import ActivitySettings from '../components/settings/ActivitySettings';
import MessageSettings from '../components/settings/MessageSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import SettingsError from '../components/settings/SettingsError';

const SettingsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('account');
  
  useEffect(() => {
    // Extrair a seção ativa da URL
    const path = location.pathname.split('/');
    const section = path[path.length - 1];
    
    if (section && section !== 'settings') {
      setActiveTab(section);
    } else {
      setActiveTab('account');
      // Redirecionar para a seção padrão (agora é 'account' em vez de 'profile')
      navigate('/settings/account', { replace: true });
    }
  }, [location, navigate]);
  
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };
  
  if (!currentUser) {
    return <div className="p-6">Você precisa estar logado para acessar as configurações.</div>;
  }
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:flex md:gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <nav className="space-y-1">
            <Link 
              to="/settings/account" 
              className={`${activeTab === 'account' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>🔐 Conta e Segurança</span>
            </Link>
            <Link 
              to="/settings/notifications" 
              className={`${activeTab === 'notifications' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>🔔 Notificações</span>
            </Link>
            <Link 
              to="/settings/privacy" 
              className={`${activeTab === 'privacy' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>👁️ Privacidade</span>
            </Link>
            <Link 
              to="/settings/connections" 
              className={`${activeTab === 'connections' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>❤️ Seguidores e Conexões</span>
            </Link>
            <Link 
              to="/settings/activity" 
              className={`${activeTab === 'activity' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>📝 Atividade e Registro</span>
            </Link>
            <Link 
              to="/settings/messages" 
              className={`${activeTab === 'messages' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>💬 Mensagens</span>
            </Link>
            <Link 
              to="/settings/security" 
              className={`${activeTab === 'security' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>🛡️ Segurança e Denúncias</span>
            </Link>
            <Link 
              to="/settings/theme" 
              className={`${activeTab === 'theme' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>🎨 Tema e Interface</span>
            </Link>
            <Link 
              to="/settings/content" 
              className={`${activeTab === 'content' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span>📱 Conteúdo</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-30 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
            >
              <span>🚪 Sair</span>
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="mt-5 md:mt-0 md:w-3/4">
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <Routes>
              <Route path="account" element={<AccountSettings currentUser={currentUser} />} />
              <Route path="notifications" element={<NotificationSettings currentUser={currentUser} />} />
              <Route path="privacy" element={<PrivacySettings currentUser={currentUser} />} />
              <Route path="connections" element={<ConnectionSettings currentUser={currentUser} />} />
              <Route path="activity" element={<ActivitySettings currentUser={currentUser} />} />
              <Route path="messages" element={<MessageSettings currentUser={currentUser} />} />
              <Route path="security" element={<SecuritySettings currentUser={currentUser} />} />
              <Route path="theme" element={<ThemeSettings theme={theme} setTheme={setTheme} />} />
              <Route path="content" element={<ContentSettings currentUser={currentUser} />} />
              <Route path="" element={<AccountSettings currentUser={currentUser} />} />
              <Route path="*" element={<SettingsError />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 