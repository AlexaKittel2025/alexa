import { testCredentials } from '@/services/MockAuthService';
import { FaUser, FaLock, FaInfoCircle } from 'react-icons/fa';

export default function TestCredentials() {
  // Sempre mostrar o componente para facilitar o teste
  // Em produção real, você removeria ou condicionaria isso

  return (
    <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-4">
      <div className="flex items-center mb-2">
        <FaInfoCircle className="text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="font-semibold text-blue-800 dark:text-blue-300">
          Credenciais de Teste (Desenvolvimento)
        </h3>
      </div>
      
      <div className="space-y-3">
        {testCredentials.map((cred, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded p-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {cred.description}
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaUser className="mr-1" />
              <span className="font-mono">{cred.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaLock className="mr-1" />
              <span className="font-mono">{cred.password}</span>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Use qualquer uma dessas credenciais para testar o sistema
      </p>
    </div>
  );
}