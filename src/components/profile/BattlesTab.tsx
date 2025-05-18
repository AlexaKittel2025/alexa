import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Battle, BattleParticipant } from '../../types';

interface BattlesTabProps {
  userId: string;
  isCurrentUser: boolean;
}

const BattlesTab: React.FC<BattlesTabProps> = ({ userId, isCurrentUser }) => {
  const [battleParticipations, setBattleParticipations] = useState<BattleParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBattles = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/users/${userId}/battles?page=${pageNum}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar batalhas');
      }
      
      const data = await response.json();
      
      if (pageNum === 1) {
        setBattleParticipations(data.battles);
      } else {
        setBattleParticipations(prev => [...prev, ...data.battles]);
      }
      
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      
      setError(err instanceof Error ? err.message : 'Erro ao carregar batalhas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBattles(1);
    }
  }, [userId]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchBattles(page + 1);
    }
  };

  // Função para formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para determinar status da batalha
  const getBattleStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Em andamento';
      case 'completed': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  // Função para determinar a cor do status
  const getBattleStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {loading && battleParticipations.length === 0 ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : battleParticipations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            {isCurrentUser 
              ? "Você ainda não participou de nenhuma batalha. Participe de uma batalha de mentiras!" 
              : "Este usuário ainda não participou de nenhuma batalha."}
          </p>
          {isCurrentUser && (
            <Link
              to="/battles"
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90"
            >
              Participar de uma batalha
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {battleParticipations.map(participation => (
              <div 
                key={participation.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
              >
                <Link 
                  to={`/battles/${participation.battle_id}`}
                  className="hover:text-primary"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{participation.battle?.title || 'Batalha de Mentiras'}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {participation.battle?.description?.substring(0, 100) || participation.content.substring(0, 100)}
                        {(participation.battle?.description?.length || 0) > 100 || participation.content.length > 100 ? '...' : ''}
                      </p>
                    </div>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${getBattleStatusColor(participation.battle?.status || 'active')}`}
                    >
                      {getBattleStatusText(participation.battle?.status || 'active')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Votos: </span>
                        <span className="ml-1 font-semibold">{participation.votes}</span>
                      </div>
                      
                      {participation.battle?.winner_id === userId && (
                        <span className="flex items-center text-yellow-500">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0115 3v1h1a1 1 0 110 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 01-1-1z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-sm font-semibold">Vencedor</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {participation.battle?.start_date && (
                        <span>
                          {formatDate(participation.battle.start_date)}
                          {participation.battle.end_date && (
                            <> - {formatDate(participation.battle.end_date)}</>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`px-6 py-2 rounded-full border ${
                  loading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-300'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando...
                  </span>
                ) : (
                  'Carregar mais'
                )}
              </button>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BattlesTab; 