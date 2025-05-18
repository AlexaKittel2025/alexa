'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaTrophy, FaFire } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Dados falsos para simular o ranking
const fakeUsers = [
  {
    uid: 'fake1',
    displayName: 'Carlos Mendes',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    score: 1107,
    postCount: 26,
    position: 1
  },
  {
    uid: 'fake2',
    displayName: 'Ana Beatriz',
    photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
    score: 984,
    postCount: 24,
    position: 2
  },
  {
    uid: 'fake3',
    displayName: 'Rodrigo Lima',
    photoURL: 'https://randomuser.me/api/portraits/men/67.jpg',
    score: 861,
    postCount: 22,
    position: 3
  },
  {
    uid: 'fake4',
    displayName: 'Juliana Costa',
    photoURL: 'https://randomuser.me/api/portraits/women/12.jpg',
    score: 738,
    postCount: 19,
    position: 4
  },
  {
    uid: 'fake5',
    displayName: 'Pedro Almeida',
    photoURL: 'https://randomuser.me/api/portraits/men/23.jpg',
    score: 615,
    postCount: 15,
    position: 5
  },
  {
    uid: 'fake6',
    displayName: 'Clara Santos',
    photoURL: 'https://randomuser.me/api/portraits/women/89.jpg',
    score: 584,
    postCount: 18,
    position: 6
  },
  {
    uid: 'fake7',
    displayName: 'Felipe Oliveira',
    photoURL: 'https://randomuser.me/api/portraits/men/45.jpg',
    score: 532,
    postCount: 14,
    position: 7
  },
  {
    uid: 'fake8',
    displayName: 'Mariana Silva',
    photoURL: 'https://randomuser.me/api/portraits/women/75.jpg',
    score: 498,
    postCount: 16,
    position: 8
  },
  {
    uid: 'fake9',
    displayName: 'Roberto Gomes',
    photoURL: 'https://randomuser.me/api/portraits/men/55.jpg',
    score: 473,
    postCount: 12,
    position: 9
  },
  {
    uid: 'fake10',
    displayName: 'Camila Ferreira',
    photoURL: 'https://randomuser.me/api/portraits/women/62.jpg',
    score: 442,
    postCount: 11,
    position: 10
  }
];

// Mais dados falsos para outros períodos de tempo
const fakeUsersMonth = [
  {
    uid: 'fake11',
    displayName: 'Leonardo Dias',
    photoURL: 'https://randomuser.me/api/portraits/men/72.jpg',
    score: 894,
    postCount: 18,
    position: 1
  },
  {
    uid: 'fake12',
    displayName: 'Bianca Martins',
    photoURL: 'https://randomuser.me/api/portraits/women/33.jpg',
    score: 762,
    postCount: 15,
    position: 2
  },
  {
    uid: 'fake1',
    displayName: 'Carlos Mendes',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    score: 695,
    postCount: 14,
    position: 3
  },
  {
    uid: 'fake13',
    displayName: 'Raquel Souza',
    photoURL: 'https://randomuser.me/api/portraits/women/58.jpg',
    score: 621,
    postCount: 12,
    position: 4
  },
  {
    uid: 'fake14',
    displayName: 'Gabriel Campos',
    photoURL: 'https://randomuser.me/api/portraits/men/28.jpg',
    score: 587,
    postCount: 10,
    position: 5
  }
];

const fakeUsersWeek = [
  {
    uid: 'fake15',
    displayName: 'Tiago Pereira',
    photoURL: 'https://randomuser.me/api/portraits/men/18.jpg',
    score: 354,
    postCount: 6,
    position: 1
  },
  {
    uid: 'fake11',
    displayName: 'Leonardo Dias',
    photoURL: 'https://randomuser.me/api/portraits/men/72.jpg',
    score: 283,
    postCount: 5,
    position: 2
  },
  {
    uid: 'fake16',
    displayName: 'Maria Eduarda',
    photoURL: 'https://randomuser.me/api/portraits/women/22.jpg',
    score: 214,
    postCount: 4,
    position: 3
  },
  {
    uid: 'fake17',
    displayName: 'Bruno Costa',
    photoURL: 'https://randomuser.me/api/portraits/men/37.jpg',
    score: 176,
    postCount: 3,
    position: 4
  },
  {
    uid: 'fake12',
    displayName: 'Bianca Martins',
    photoURL: 'https://randomuser.me/api/portraits/women/33.jpg',
    score: 158,
    postCount: 3,
    position: 5
  }
];

interface RankingUser {
  uid: string;
  displayName: string;
  photoURL: string | null;
  score: number;
  postCount: number;
  position: number;
}

export default function UserRanking() {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      
      // Simular tempo de carregamento
      setTimeout(() => {
        let rankingData: RankingUser[] = [];
        
        // Selecionar dados baseados no período de tempo
        switch (timeRange) {
          case 'all':
            rankingData = fakeUsers;
            break;
          case 'month':
            rankingData = fakeUsersMonth;
            break;
          case 'week':
            rankingData = fakeUsersWeek;
            break;
        }
        
        setUsers(rankingData);
        setLoading(false);
      }, 500);
    };
    
    fetchRanking();
  }, [timeRange]);
  
  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500'; // Ouro
      case 2: return 'text-gray-400';   // Prata
      case 3: return 'text-amber-700';  // Bronze
      default: return 'text-purple-600';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-purple-700 text-white p-4">
        <h2 className="text-lg font-semibold">Ranking de Mentirosos</h2>
        <p className="text-sm text-purple-200">Os usuários com as mentiras mais populares</p>
      </div>
      
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRange === 'all' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos os tempos
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRange === 'month' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Este mês
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRange === 'week' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Esta semana
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : users.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Nenhum usuário encontrado para este período.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div
              key={user.uid}
              className="flex items-center p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 mr-3">
                <FaTrophy className={`${getTrophyColor(user.position)} text-lg`} />
              </div>
              
              <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center mr-3 overflow-hidden">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <FaUser className="text-purple-600" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{user.displayName}</h3>
                <div className="flex text-xs text-gray-500 space-x-2">
                  <span>{user.postCount} mentiras</span>
                </div>
              </div>
              
              <div className="ml-4 flex items-center text-lg font-bold text-purple-700">
                <FaFire className="mr-1 text-amber-500" />
                {user.score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 