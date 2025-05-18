;

;
import { DesktopComputerIcon, MoonIcon, SunIcon } from '@heroicons/react/outline';
import React from 'react';interface ThemeSettingsProps {
  theme: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ theme, setTheme }) => {
  const [message, setMessage] = React.useState<string | null>(null);
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setMessage(`Tema alterado para ${
      newTheme === 'light' ? 'Claro' : 
      newTheme === 'dark' ? 'Escuro' : 
      'Sistema'
    }`);
    
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tema e Interface</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className={`p-6 border rounded-lg flex flex-col items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}
            onClick={() => handleThemeChange('light')}
          >
            <SunIcon className="h-12 w-12 text-yellow-500 mb-4" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">Claro</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              Interface com fundo claro para ambientes bem iluminados
            </p>
          </div>
          
          <div 
            className={`p-6 border rounded-lg flex flex-col items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}
            onClick={() => handleThemeChange('dark')}
          >
            <MoonIcon className="h-12 w-12 text-blue-700 dark:text-blue-400 mb-4" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">Escuro</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              Interface com fundo escuro, ideal para uso noturno
            </p>
          </div>
          
          <div 
            className={`p-6 border rounded-lg flex flex-col items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${theme === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}
            onClick={() => handleThemeChange('system')}
          >
            <DesktopComputerIcon className="h-12 w-12 text-gray-600 dark:text-gray-400 mb-4" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">Sistema</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              Acompanha as configurações do seu dispositivo
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-medium">Dica:</span> O tema escuro pode reduzir o consumo de bateria em dispositivos com tela OLED e proporcionar uma experiência mais confortável em ambientes com pouca luz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings; 