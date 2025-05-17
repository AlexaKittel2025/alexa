import React, { useState, useEffect } from 'react';
import { FireIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import UserProfileLink from './UserProfileLink';
import { rankingService, RankingPeriod, RankingUser } from '../services/rankingService';

const RankingCard: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<RankingPeriod>('all-time');
  const [rankingData, setRankingData] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRankingData();
  }, [activePeriod]);

  const fetchRankingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await rankingService.getRanking(activePeriod);
      setRankingData(data);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      setError('Não foi possível carregar o ranking. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Componente para o ícone de medalha
  const MedalIcon: React.FC<{position: number}> = ({ position }) => {
    const colors = ['text-yellow-500', 'text-gray-400', 'text-amber-600', 'text-purple-500'];
    
    return (
      <div className={`${colors[position]} text-xl font-bold`}>
        {position === 0 && '🏆'}
        {position === 1 && '🥈'}
        {position === 2 && '🥉'}
        {position === 3 && '💫'}
      </div>
    );
  };

  // Tradução dos períodos
  const periodLabels: {[key in RankingPeriod]: string} = {
    'all-time': 'Todos os tempos',
    'month': 'Este mês',
    'week': 'Esta semana'
  };

  if (isLoading) {
    return (
      <div className="bg-purple-600 text-white rounded-lg shadow-lg p-4">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-purple-600 text-white rounded-lg shadow-lg p-4">
        <div className="text-center py-4">
          <p className="text-red-300 mb-2">{error}</p>
          <button
            onClick={fetchRankingData}
            className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-400"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-600 text-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold mb-1">Ranking de Mentirosos</h2>
      <p className="text-sm text-purple-200 mb-4">Os usuários com as mentiras mais populares</p>
      
      {/* Tabs para alternar períodos */}
      <div className="flex border-b border-purple-500 mb-4">
        {Object.entries(periodLabels).map(([period, label]) => (
          <button
            key={period}
            className={`py-2 px-3 text-xs font-medium ${
              activePeriod === period
                ? 'border-b-2 border-white'
                : 'text-purple-200 hover:text-white'
            }`}
            onClick={() => setActivePeriod(period as RankingPeriod)}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Lista de usuários */}
      {rankingData.length === 0 ? (
        <p className="text-center text-purple-200 py-4">
          Nenhum usuário encontrado para este período.
        </p>
      ) : (
        <ul className="space-y-3">
          {rankingData.map((user, index) => (
            <li key={user.id} className="flex items-center">
              <MedalIcon position={index} />
              
              <UserProfileLink userId={user.id} className="mx-3">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              </UserProfileLink>
              
              <div className="flex-1">
                <UserProfileLink userId={user.id} className="hover:underline">
                  <p className="font-medium cursor-pointer">
                    {user.displayName}
                  </p>
                </UserProfileLink>
                <p className="text-xs text-purple-200">{user.postCount} mentiras</p>
              </div>
              
              <div className="flex items-center text-amber-300">
                <FireIcon className="h-4 w-4 mr-1" />
                <span className="font-bold">{user.points}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RankingCard; 