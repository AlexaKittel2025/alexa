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
import { useTheme } from 'next-themes';

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
      likes: true,
      comments: true,
      follows: true,
      messages: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showLastSeen: true,
      allowMessages: 'everyone',
      allowTagging: true
    },
    interface: {
      darkMode: false,
      compactMode: false,
      showAnimations: true,
      fontSize: 'medium',
    }
  });

  // Carregar configurações e perfil salvos
  useEffect(() => {
    const savedSettings = loadUserSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Aplicar tema inicial
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setSettings(prev => ({
        ...prev,
        interface: { ...prev.interface, darkMode: true }
      }));
    }
  }, []);

  // Salvar configurações quando mudarem
  useEffect(() => {
    saveUserSettings(settings);
  }, [settings]);

  const renderSection = () => {
    switch (activeSection) {
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
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Configurações</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu lateral */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="text-xl" />
                  <div className="text-left">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm opacity-75">{item.description}</p>
                  </div>
                  <FaChevronRight className="ml-auto opacity-50" />
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Conteúdo da seção ativa */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes de seção continuam abaixo...
// Seção Segurança
function SegurancaSection({ settings, setSettings }: { settings: any, setSettings: any }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Segurança e Login</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Alterar Senha</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha Atual
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Atualizar Senha
            </button>
          </div>
        </div>
        
        <div className="pt-6 border-t dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Autenticação de Dois Fatores</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Adicione uma camada extra de segurança à sua conta
          </p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Ativar 2FA
          </button>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Visibilidade do Perfil
          </label>
          <select 
            value={settings.privacy.profileVisibility}
            onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="public">Público</option>
            <option value="friends">Apenas amigos</option>
            <option value="private">Privado</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Mostrar E-mail</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Exibir seu e-mail no perfil público
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.privacy.showEmail}
              onChange={(e) => updatePrivacySetting('showEmail', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Última Vez Visto</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrar quando você esteve online pela última vez
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.privacy.showLastSeen}
              onChange={(e) => updatePrivacySetting('showLastSeen', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quem pode enviar mensagens
          </label>
          <select 
            value={settings.privacy.allowMessages}
            onChange={(e) => updatePrivacySetting('allowMessages', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="everyone">Todos</option>
            <option value="friends">Apenas amigos</option>
            <option value="none">Ninguém</option>
          </select>
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
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Notificações Gerais</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ativar ou desativar todas as notificações
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.notifications.enabled}
              onChange={(e) => updateNotificationSetting('enabled', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div className="space-y-3">
          <NotificationToggle
            label="E-mail"
            description="Receber notificações por e-mail"
            checked={settings.notifications.email}
            onChange={(value) => updateNotificationSetting('email', value)}
            disabled={!settings.notifications.enabled}
          />
          
          <NotificationToggle
            label="Push"
            description="Notificações no navegador"
            checked={settings.notifications.push}
            onChange={(value) => updateNotificationSetting('push', value)}
            disabled={!settings.notifications.enabled}
          />
          
          <NotificationToggle
            label="Curtidas"
            description="Quando alguém curtir suas postagens"
            checked={settings.notifications.likes}
            onChange={(value) => updateNotificationSetting('likes', value)}
            disabled={!settings.notifications.enabled}
          />
          
          <NotificationToggle
            label="Comentários"
            description="Quando comentarem em suas postagens"
            checked={settings.notifications.comments}
            onChange={(value) => updateNotificationSetting('comments', value)}
            disabled={!settings.notifications.enabled}
          />
          
          <NotificationToggle
            label="Seguidores"
            description="Quando alguém começar a seguir você"
            checked={settings.notifications.follows}
            onChange={(value) => updateNotificationSetting('follows', value)}
            disabled={!settings.notifications.enabled}
          />
          
          <NotificationToggle
            label="Mensagens"
            description="Quando receber novas mensagens"
            checked={settings.notifications.messages}
            onChange={(value) => updateNotificationSetting('messages', value)}
            disabled={!settings.notifications.enabled}
          />
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para toggle de notificações
function NotificationToggle({ label, description, checked, onChange, disabled }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
      </label>
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
            <option value="YYYY-MM-DD">AAAA-MM-DD</option>
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
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Dados Básicos</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Nome de usuário</span>
              <span className="font-medium text-gray-900 dark:text-white">@{userProfile.username}</span>
            </div>
            <div className="flex justify-between py-3 border-b dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">E-mail</span>
              <span className="font-medium text-gray-900 dark:text-white">{userProfile.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Nome completo</span>
              <span className="font-medium text-gray-900 dark:text-white">{userProfile.name}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Assinatura</h3>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="font-medium text-purple-800 dark:text-purple-300">Plano Gratuito</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              Acesso limitado aos recursos básicos
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Fazer Upgrade para Pro
            </button>
          </div>
        </div>
        
        <div className="pt-6 border-t dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-red-600">Zona de Perigo</h3>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Excluir Conta
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Esta ação não pode ser desfeita
          </p>
        </div>
      </div>
    </div>
  );
}

// Seção Interface - CORRIGIDA
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

  const { theme, setTheme } = useTheme();
  
  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    updateInterfaceSetting('darkMode', theme !== 'dark');
  };
  
  // Sincronizar o estado do dark mode com o ThemeContext
  useEffect(() => {
    const isDarkMode = theme === 'dark';
    if (settings.interface.darkMode !== isDarkMode) {
      updateInterfaceSetting('darkMode', isDarkMode);
    }
  }, [theme]);

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
              checked={theme === 'dark'}
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
              checked={settings.interface.showAnimations}
              onChange={(e) => updateInterfaceSetting('showAnimations', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}