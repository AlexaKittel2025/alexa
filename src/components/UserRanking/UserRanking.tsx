'use client';

import React, { useEffect, useState } from 'react';
import { FaCrown, FaMedal, FaTrophy, FaStar, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';

interface User {
  id: string;
  display_name?: string;
  image?: string;
  score: number;
  pontuacaoTotal?: number;
  name?: string;
  level?: number;
  title?: string;
  battleWins?: number;
  totalPosts?: number;
  position?: number;
}

type RankingPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';

const UserRanking: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<RankingPeriod>('all-time');

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/users/ranking?period=${period}&limit=10`);
        
        if (!response.ok) {
          throw new Error(`Falha ao carregar ranking: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.users) {
          setUsers(data.users.map((user: any) => ({
            ...user,
            score: user.pontuacaoTotal || user.score || 0
          })));
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Erro ao buscar ranking:', error);
        setError('Não foi possível carregar o ranking de usuários');
        
        // Dados de fallback para demonstração
        setUsers([
          { id: '1', display_name: 'Carlos Mendes', score: 1107, level: 5, title: 'Mestre das Mentiras', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
          { id: '2', display_name: 'Ana Beatriz', score: 984, level: 4, title: 'Mentirosa Profissional', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
          { id: '3', display_name: 'Rodrigo Lima', score: 861, level: 4, title: 'Mentiroso Profissional', image: 'https://randomuser.me/api/portraits/men/67.jpg' },
          { id: '4', display_name: 'Juliana Costa', score: 738, level: 3, title: 'Mentirosa Experiente', image: 'https://randomuser.me/api/portraits/women/12.jpg' },
          { id: '5', display_name: 'Pedro Almeida', score: 615, level: 3, title: 'Mentiroso Experiente', image: 'https://randomuser.me/api/portraits/men/23.jpg' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, [period]);

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <FaCrown className="text-yellow-400" size={20} />;
      case 1:
        return <FaMedal className="text-gray-400" size={20} />;
      case 2:
        return <FaTrophy className="text-amber-700" size={20} />;
      default:
        return null;
    }
  };

  // Nome de exibição real do usuário
  const displayName = (user: User) => user.display_name || user.name || 'Usuário';

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Ranking de Usuários</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Ranking de Usuários</h2>
        <div className="flex items-center space-x-2">
          <FaChartLine className="text-purple-600" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as RankingPeriod)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
          >
            <option value="daily">Hoje</option>
            <option value="weekly">Semana</option>
            <option value="monthly">Mês</option>
            <option value="all-time">Geral</option>
          </select>
        </div>
      </div>
      
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      
      <div className="space-y-3">
        {users.map((user, index) => (
          <Link href={`/perfil/${user.id}`} key={user.id}>
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center justify-center w-8">
                {getMedalIcon(index)}
                {!getMedalIcon(index) && <span className="text-gray-500">#{index + 1}</span>}
              </div>
              <div className="w-10 h-10 relative">
                <img
                  src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName(user)}`}
                  alt={displayName(user)}
                  className="w-full h-full rounded-full object-cover"
                />
                {user.level && user.level >= 4 && (
                  <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1">
                    <FaStar className="text-white text-xs" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{displayName(user)}</p>
                {user.title && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.title}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-600">{user.score.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  Nível {user.level || 1}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/ranking" className="text-purple-600 hover:underline text-sm">
          Ver ranking completo
        </Link>
      </div>
    </div>
  );
};

export default UserRanking; 