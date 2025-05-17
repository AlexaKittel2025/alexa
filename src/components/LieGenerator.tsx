import React, { useState } from 'react';
import { generateRandomLie } from '../services/userService';

interface LieGeneratorProps {
  userId: string;
  onGenerated: (lie: string) => void;
  onNeedsPro: () => void;
}

const LieGenerator: React.FC<LieGeneratorProps> = ({ userId, onGenerated, onNeedsPro }) => {
  const [customTopic, setCustomTopic] = useState<string>('');
  const [generatedLie, setGeneratedLie] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTopic(e.target.value);
  };

  const handleGenerateLie = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mentira = await generateRandomLie(userId, customTopic);
      if (mentira) {
        setGeneratedLie(mentira);
        onGenerated(mentira);
      } else {
        setError('Não foi possível gerar uma mentira. Tente novamente.');
        onNeedsPro();
      }
    } catch (error) {
      setError('Erro ao gerar mentira. Tente novamente.');
      console.error('Erro ao gerar mentira:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gerador de Mentiras Criativas</h2>
      
      <div className="mb-4">
        <label htmlFor="customTopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tópico ou Tema (opcional)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="customTopic"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: aliens, viagem, família..."
            value={customTopic}
            onChange={handleInputChange}
          />
          <button
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            onClick={handleGenerateLie}
            disabled={isLoading}
          >
            {isLoading ? 'Gerando...' : 'Gerar Mentira'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      {generatedLie && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Mentira Gerada:</h3>
          <p className="text-gray-800 dark:text-gray-200 italic">{generatedLie}</p>
          <div className="mt-3 flex justify-end">
            <button
              className="text-sm text-primary hover:text-primary/80 dark:text-primary-light dark:hover:text-primary-light/80"
              onClick={() => onGenerated(generatedLie)}
            >
              Usar esta mentira
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LieGenerator; 