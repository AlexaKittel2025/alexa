import React from 'react';

interface ProfileStatsProps {
  totalReactions: number;
  totalJudgements: number;
  credibilityScore: number;
  creativityScore: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalReactions,
  totalJudgements,
  credibilityScore,
  creativityScore
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Estatísticas de Mentiras</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <span className="block text-xl font-bold text-gray-900 dark:text-white">{totalReactions}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Reações</span>
        </div>
        
        <div className="text-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <span className="block text-xl font-bold text-gray-900 dark:text-white">{totalJudgements}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Julgamentos</span>
        </div>
        
        {/* Pontuação de Credibilidade */}
        <div className="text-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="relative w-16 h-16 mx-auto mb-1">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
                strokeDasharray="100, 100"
                className="dark:stroke-gray-600"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray={`${credibilityScore}, 100`}
                className="stroke-blue-500 dark:stroke-blue-400"
              />
              <text x="18" y="20.5" textAnchor="middle" fontSize="10" fill="currentColor" className="text-gray-900 dark:text-white font-medium">
                {credibilityScore}%
              </text>
            </svg>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Credibilidade</span>
        </div>
        
        {/* Pontuação de Criatividade */}
        <div className="text-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="relative w-16 h-16 mx-auto mb-1">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
                strokeDasharray="100, 100"
                className="dark:stroke-gray-600"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeDasharray={`${creativityScore}, 100`}
                className="stroke-purple-500 dark:stroke-purple-400"
              />
              <text x="18" y="20.5" textAnchor="middle" fontSize="10" fill="currentColor" className="text-gray-900 dark:text-white font-medium">
                {creativityScore}%
              </text>
            </svg>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Criatividade</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats; 