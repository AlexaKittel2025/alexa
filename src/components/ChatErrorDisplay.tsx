;

;
import { RefreshIcon } from '@heroicons/react/outline';
import React from 'react';

interface ChatErrorDisplayProps {
  onRetry: () => void;
}

const ChatErrorDisplay: React.FC<ChatErrorDisplayProps> = ({ onRetry }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-6 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-16 w-16 text-red-500 dark:text-red-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300">
            Erro ao conectar ao servidor
          </h2>
          <p className="text-center max-w-lg">
            Não foi possível estabelecer conexão com o servidor de chat. Isso pode ocorrer pelos seguintes motivos:
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-lg mt-2">
            <ol className="list-decimal list-inside space-y-2 text-red-700 dark:text-red-300">
              <li>O servidor API não está rodando na porta 3001</li>
              <li>Há um problema de rede entre o seu navegador e o servidor</li>
              <li>O servidor está sobrecarregado ou indisponível no momento</li>
            </ol>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg w-full max-w-lg mt-2 text-yellow-700 dark:text-yellow-300">
            <p className="font-medium">O que fazer:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Verifique se o servidor está rodando usando o comando: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">npm run server</code></li>
              <li>Certifique-se de que não há outros serviços usando a porta 3001</li>
              <li>Tente reiniciar o servidor de API e depois clique em "Tentar novamente"</li>
            </ul>
          </div>
          
          <button 
            className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex items-center transition-colors"
            onClick={onRetry}
          >
            <RefreshIcon className="h-5 w-5 mr-2" />
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatErrorDisplay; 