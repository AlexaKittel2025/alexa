'use client';

import { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaShieldAlt, 
  FaLock, 
  FaBell, 
  FaGlobe, 
  FaIdCard, 
  FaPalette,
  FaChevronRight
} from 'react-icons/fa';
import { loadUserSettings, saveUserSettings } from '@/utils/persistenceUtils';

type SectionType = 'geral' | 'seguranca' | 'privacidade' | 'notificacoes' | 'idioma' | 'conta' | 'interface';

interface MenuItem {
  id: SectionType;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const menuItems: MenuItem[] = [
  { id: 'seguranca', label: 'Segurança e Login', icon: FaShieldAlt, description: 'Senha e autenticação' },
  { id: 'privacidade', label: 'Privacidade', icon: FaLock, description: 'Controle quem pode ver seu conteúdo' },
  { id: 'notificacoes', label: 'Notificações', icon: FaBell, description: 'Gerencie seus alertas' },
  { id: 'idioma', label: 'Idioma e Região', icon: FaGlobe, description: 'Preferências de localização' },
  { id: 'conta', label: 'Informações da Conta', icon: FaIdCard, description: 'Dados da conta e assinatura' },
  { id: 'interface', label: 'Preferências de Interface', icon: FaPalette, description: 'Temas e aparência' },
];

export default function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState<SectionType>('seguranca');
  const [userProfile, setUserProfile] = useState({
    name: 'Usuário',
    email: 'usuario@email.com',
    username: 'usuario',
    bio: '',
    website: '',
    location: ''
  });
  const [settings, setSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    language: 'pt-BR',
    notifications: {
      enabled: true,
      email: true,
      push: true,
      mentions: true,
      newFollowers: true,
      likes: true,
      comments: true
    },
    privacy: {
      profileVisibility: 'public' as 'public' | 'friends' | 'private',
      showEmail: false,
      showFollowers: true,
      showFollowing: true,
      showOnlineStatus: true,
      activityVisibility: 'followers',
      searchVisibility: 'public',
      shareProfile: true,
      contentVisibility: 'public',
      commentPermission: 'anyone',
      showShare: true,
      tagPermission: 'anyone',
      allowMentions: true
    },
    security: {
      blockedUsers: [],
      reportedUsers: [],
      twoFactorEnabled: false,
      loginNotifications: true,
      allowAccountRecovery: true
    },
    interface: {
      darkMode: false,
      compactMode: false,
      fontSize: 'medium' as 'small' | 'medium' | 'large',
      colorScheme: 'purple'
    }
  });

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile({
          name: profile.name || 'Usuário',
          email: profile.email || 'usuario@email.com',
          username: profile.username || 'usuario',
          bio: profile.bio || '',
          website: profile.website || '',
          location: profile.location || ''
        });
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    }
    
    // Carregar configurações do localStorage
    const savedSettings = loadUserSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);
  
  // Salvar configurações sempre que mudarem
  useEffect(() => {
    saveUserSettings(settings);
  }, [settings]);

  const renderContent = () => {
    switch (activeSection) {
      case 'geral':
        return <GeralSection userProfile={userProfile} />;
      case 'seguranca':
        return <SegurancaSection settings={settings} setSettings={setSettings} />;
      case 'privacidade':
        return <PrivacidadeSection settings={settings} setSettings={setSettings} />;
      case 'notificacoes':
        return <NotificacoesSection settings={settings} setSettings={setSettings} />;
      case 'idioma':
        return <IdiomaSection settings={settings} setSettings={setSettings} />;
      case 'conta':
        return <ContaSection userProfile={userProfile} />;
      case 'interface':
        return <InterfaceSection settings={settings} setSettings={setSettings} />;
      default:
        return <GeralSection userProfile={userProfile} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Configurações</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Menu lateral */}
        <aside className="lg:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <nav className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 mb-1 ${
                    activeSection === item.id
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <FaChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Seção Geral
function GeralSection({ userProfile }: { userProfile: any }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Informações Gerais</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome
          </label>
          <input
            type="text"
            defaultValue={userProfile.name}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome de usuário
          </label>
          <input
            type="text"
            defaultValue={userProfile.username}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            defaultValue={userProfile.email}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            defaultValue={userProfile.bio}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

// Seção Segurança
function SegurancaSection({ settings, setSettings }: { settings: any, setSettings: any }) {
  const updateSecuritySetting = (key: string, value: any) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [key]: value
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Segurança e Login</h2>
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Alterar Senha</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha Atual
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Atualizar Senha
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Autenticação de Dois Fatores</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Adicione uma camada extra de segurança à sua conta
          </p>
          <button 
            onClick={() => updateSecuritySetting('twoFactorEnabled', !settings.security.twoFactorEnabled)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              settings.security.twoFactorEnabled 
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {settings.security.twoFactorEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
          </button>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Outras Configurações</h3>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-3" 
              checked={settings.security.loginNotifications}
              onChange={(e) => updateSecuritySetting('loginNotifications', e.target.checked)}
            />
            <span className="text-gray-700 dark:text-gray-300">Notificar logins em novos dispositivos</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-3" 
              checked={settings.security.allowAccountRecovery}
              onChange={(e) => updateSecuritySetting('allowAccountRecovery', e.target.checked)}
            />
            <span className="text-gray-700 dark:text-gray-300">Permitir recuperação de conta</span>
          </label>
        </div>
      </div>
    </div>
  );
}

// Seção Privacidade
function PrivacidadeSection({ settings, setSettings }: { settings: any, setSettings: any }) {
  const updatePrivacySetting = (key: string, value: any) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Privacidade</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Conta Privada</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Apenas seguidores aprovados podem ver suas mentiras
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.privacy.profileVisibility === 'private'}
              onChange={(e) => updatePrivacySetting('profileVisibility', e.target.checked ? 'private' : 'public')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Permitir Comentários</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Outros usuários podem comentar suas mentiras
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.privacy.commentPermission === 'anyone'}
              onChange={(e) => updatePrivacySetting('commentPermission', e.target.checked ? 'anyone' : 'none')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Mostrar Status Online</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Outros podem ver quando você está ativo
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.privacy.showOnlineStatus}
              onChange={(e) => updatePrivacySetting('showOnlineStatus', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Seção Notificações
function NotificacoesSection({ settings, setSettings }: { settings: any, setSettings: any }) {
  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Notificações</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Notificações por Email</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-3" 
                checked={settings.notifications.newFollowers}
                onChange={(e) => updateNotificationSetting('newFollowers', e.target.checked)}
              />
              <span className="text-gray-700 dark:text-gray-300">Novos seguidores</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-3" 
                checked={settings.notifications.comments}
                onChange={(e) => updateNotificationSetting('comments', e.target.checked)}
              />
              <span className="text-gray-700 dark:text-gray-300">Comentários em suas mentiras</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-3" 
                checked={settings.notifications.mentions}
                onChange={(e) => updateNotificationSetting('mentions', e.target.checked)}
              />
              <span className="text-gray-700 dark:text-gray-300">Menções</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-3" 
                checked={settings.notifications.email}
                onChange={(e) => updateNotificationSetting('email', e.target.checked)}
              />
              <span className="text-gray-700 dark:text-gray-300">Newsletter semanal</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Notificações Push</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-3" 
                checked={settings.notifications.likes}
                onChange={(e) => updateNotificationSetting('likes', e.target.checked)}
              />
              <span className="text-gray-700 dark:text-gray-300">Curtidas</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-3" 
                checked={settings.notifications.newFollowers}
                onChange={(e) => updateNotificationSetting('newFollowers', e.target.checked)}
              />
              <span className="text-gray-700 dark:text-gray-300">Novos seguidores</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-3" 
                checked={settings.notifications.push}
                onChange={(e) => updateNotificationSetting('push', e.target.checked)}
              />
              <span className="text-gray-700 dark:text-gray-300">Mensagens diretas</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Seção Idioma
function IdiomaSection({ settings, setSettings }: { settings: any, setSettings: any }) {
  const updateLanguage = (language: string) => {
    setSettings({
      ...settings,
      language
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Idioma e Região</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Idioma
          </label>
          <select 
            value={settings.language}
            onChange={(e) => updateLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Região
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="BR">Brasil</option>
            <option value="US">Estados Unidos</option>
            <option value="PT">Portugal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Formato de Data
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="DD/MM/YYYY">DD/MM/AAAA</option>
            <option value="MM/DD/YYYY">MM/DD/AAAA</option>
            <option value="YYYY/MM/DD">AAAA/MM/DD</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Seção Conta
function ContaSection({ userProfile }: { userProfile: any }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Informações da Conta</h2>
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Status da Conta</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Conta criada em: 15 de março de 2024
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Último login: há 2 horas
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tipo de conta: <span className="font-medium text-purple-600 dark:text-purple-400">PRO</span>
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Dados Pessoais</h3>
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors mb-3 w-full sm:w-auto">
            Baixar meus dados
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Baixe uma cópia de todos os seus dados
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-4 text-red-600 dark:text-red-400">Zona de Perigo</h3>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mb-2">
            Desativar conta temporariamente
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Sua conta será ocultada mas poderá ser reativada
          </p>
          
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Excluir conta permanentemente
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Esta ação não pode ser desfeita
          </p>
        </div>
      </div>
    </div>
  );
}

// Seção Interface
function InterfaceSection({ settings, setSettings }: { settings: any, setSettings: any }) {
  const updateInterfaceSetting = (key: string, value: any) => {
    setSettings({
      ...settings,
      interface: {
        ...settings.interface,
        [key]: value
      }
    });
  };

  const toggleDarkMode = () => {
    const newValue = !settings.interface.darkMode;
    updateInterfaceSetting('darkMode', newValue);
    
    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Preferências de Interface</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Modo Escuro</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reduza o cansaço visual em ambientes escuros
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.interface.darkMode}
              onChange={toggleDarkMode}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamanho da Fonte
          </label>
          <select 
            value={settings.interface.fontSize}
            onChange={(e) => updateInterfaceSetting('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="small">Pequena</option>
            <option value="medium">Média</option>
            <option value="large">Grande</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Densidade da Interface
          </label>
          <select 
            value={settings.interface.compactMode ? 'compact' : 'comfortable'}
            onChange={(e) => updateInterfaceSetting('compactMode', e.target.value === 'compact')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="compact">Compacta</option>
            <option value="comfortable">Confortável</option>
            <option value="spacious">Espaçosa</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Animações</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ativar animações e transições
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={true}
              onChange={() => {}}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}