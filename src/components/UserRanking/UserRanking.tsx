'use client';

import React, { useEffect, useState } from 'react';
import { FaCrown, FaMedal, FaTrophy } from 'react-icons/fa';
import Link from 'next/link';

interface User {
  id: string;
  display_name?: string;
  image?: string;
  score: number;
  name?: string; // Para compatibilidade com diferentes formatos de resposta
}

const UserRanking: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users/ranking');
        
        if (!response.ok) {
          throw new Error(`Falha ao carregar ranking: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar ranking:', error);
        setError('Não foi possível carregar o ranking de usuários');
        
        // Dados de fallback para demonstração
        setUsers([
          { id: '1', display_name: 'Carlos Mendes', score: 1107, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
          { id: '2', display_name: 'Ana Beatriz', score: 984, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
          { id: '3', display_name: 'Rodrigo Lima', score: 861, image: 'https://randomuser.me/api/portraits/men/67.jpg' },
          { id: '4', display_name: 'Juliana Costa', score: 738, image: 'https://randomuser.me/api/portraits/women/12.jpg' },
          { id: '5', display_name: 'Pedro Almeida', score: 615, image: 'https://randomuser.me/api/portraits/men/23.jpg' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

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
      <h2 className="text-lg font-semibold mb-4">Ranking de Usuários</h2>
      
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      
      <div className="space-y-3">
        {users.map((user, index) => (
          <Link href={`/perfil/${user.id}`} key={user.id}>
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center justify-center w-8">
                {getMedalIcon(index)}
                {!getMedalIcon(index) && <span className="text-gray-500">#{index + 1}</span>}
              </div>
              <div className="w-8 h-8 relative">
                <img
                  src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName(user)}`}
                  alt={displayName(user)}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{displayName(user)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-600">{user.score}</p>
                <p className="text-xs text-gray-500">pontos</p>
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