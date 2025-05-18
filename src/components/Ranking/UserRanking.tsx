'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaTrophy, FaFire, FaStar, FaMedal, FaChartLine, FaChevronRight } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';
import { calculateLevel } from '@/lib/scoring';

interface RankingUser {
  id: string;
  displayName: string;
  username: string;
  photoURL: string | null;
  score: number;
  level: number;
  title: string;
  totalPosts: number;
  battleWins: number;
  position: number;
}

type RankingPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';

export default function UserRanking() {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<RankingPeriod>('all-time');
  const [currentUserPosition, setCurrentUserPosition] = useState<RankingUser | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      
      try {
        // Buscar ranking geral
        const response = await fetch(`/api/users/ranking?period=${period}&limit=50`);
        const data = await response.json();

        if (data.success && data.users) {
          const formattedUsers = data.users.map((user: any, index: number) => {
            const levelInfo = calculateLevel(user.pontuacaoTotal || user.score || 0);
            
            return {
              id: user.id,
              displayName: user.display_name || user.username,
              username: user.username,
              photoURL: user.image || user.photo_url || generateRealPersonAvatar(['men', 'women'][Math.random() < 0.5 ? 0 : 1]),
              score: user.pontuacaoTotal || user.score || 0,
              level: user.level || levelInfo.level,
              title: user.title || levelInfo.title,
              totalPosts: user.totalPosts || 0,
              battleWins: user.battleWins || 0,
              position: user.position || index + 1
            };
          });
          
          setUsers(formattedUsers);
        }

        // Tentar obter posição do usuário atual
        const currentUserId = localStorage.getItem('userId');
        if (currentUserId) {
          const userResponse = await fetch(`/api/users/ranking?userId=${currentUserId}&period=${period}`);
          const userData = await userResponse.json();
          if (userData) {
            setCurrentUserPosition(userData);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar ranking:', error);
        
        // Mock data para desenvolvimento
        const mockUsers = Array.from({ length: 10 }, (_, i) => {
          const score = 5000 - (i * 400);
          const levelInfo = calculateLevel(score);
          
          return {
            id: `user-${i + 1}`,
            displayName: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Ferreira', 
                         'Juliana Mendes', 'Roberto Lima', 'Beatriz Alves', 'Fernando Souza', 'Patricia Ribeiro'][i],
            username: ['joaosilva', 'mariasantos', 'pedrocosta', 'anaoliveira', 'carlosferreira',
                      'julianamendes', 'robertolima', 'beatrizalves', 'fernandosouza', 'patriciaribeiro'][i],
            photoURL: generateRealPersonAvatar(['men', 'women'][i % 2 === 0 ? 0 : 1]),
            score,
            level: levelInfo.level,
            title: levelInfo.title,
            totalPosts: 50 - (i * 3),
            battleWins: 20 - (i * 2),
            position: i + 1
          };
        });
        
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRanking();
  }, [period]);
  
  const getTrophyComponent = (position: number) => {
    switch (position) {
      case 1: 
        return <FaTrophy className="text-2xl text-yellow-500" />;
      case 2: 
        return <FaMedal className="text-2xl text-gray-400" />;
      case 3: 
        return <FaMedal className="text-2xl text-amber-700" />;
      default: 
        return <span className="text-lg font-bold text-gray-600">#{position}</span>;
    }
  };
  
  const getPositionStyles = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20';
      default:
        return '';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ranking Global</h2>
            <p className="text-purple-200">Os maiores mentirosos da plataforma</p>
          </div>
          <FaTrophy className="text-4xl text-yellow-400" />
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaChartLine className="text-purple-600 dark:text-purple-400" />
            <label className="font-medium text-gray-700 dark:text-gray-300">Período:</label>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as RankingPeriod)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <option value="daily">Hoje</option>
            <option value="weekly">Esta Semana</option>
            <option value="monthly">Este Mês</option>
            <option value="all-time">Todos os Tempos</option>
          </select>
        </div>
        
        {currentUserPosition && currentUserPosition.position > 10 && (
          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Sua posição: <strong>#{currentUserPosition.position}</strong> com {currentUserPosition.score} pontos
            </p>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="p-8 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Nenhum usuário encontrado para este período.
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {users.map((user) => (
            <Link href={`/perfil/${user.id}`} key={user.id}>
              <div
                className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${getPositionStyles(user.position)}`}
              >
                <div className="flex items-center justify-center w-16 mr-4">
                  {getTrophyComponent(user.position)}
                </div>
                
                <div className="relative">
                  <img 
                    src={user.photoURL || generateRealPersonAvatar(['men', 'women'][Math.random() < 0.5 ? 0 : 1])} 
                    alt={user.displayName} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" 
                  />
                  {user.level >= 5 && (
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1">
                      <FaStar className="text-white text-xs" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{user.displayName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {user.title} • Nível {user.level}
                  </p>
                  <div className="flex space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{user.totalPosts} mentiras</span>
                    <span>{user.battleWins} vitórias</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-2xl font-bold text-purple-700 dark:text-purple-400">
                    <FaFire className="mr-2 text-amber-500" />
                    {user.score.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">pontos</p>
                </div>
                
                <FaChevronRight className="ml-4 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && users.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando top {users.length} mentirosos
          </p>
        </div>
      )}
    </div>
  );
}