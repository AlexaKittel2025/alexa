'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaCrown, FaTrophy, FaChartLine, FaUsers } from 'react-icons/fa';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';
import { loadUserStats, saveUserStats } from '@/utils/persistenceUtils';
import Link from 'next/link';

// Lazy load do componente BattleMentiras
const BattleMentiras = dynamic(() => import('@/components/Game/BattleMentiras'), {
  loading: () => <div className="flex justify-center items-center h-96"><span className="text-xl">Carregando batalha...</span></div>,
  ssr: false
});

export default function BatalhasPage() {
  const [activeTab, setActiveTab] = useState<'battle' | 'ranking'>('battle');
  const [userStats, setUserStats] = useState<any>(null);
  const [rankingData, setRankingData] = useState<any[]>([]);
  
  // Carregar dados do usuário
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (currentUser.id) {
      const stats = loadUserStats(currentUser.id);
      if (stats) {
        setUserStats(stats);
      }
    }
    
    // Carregar dados de ranking
    const loadRanking = () => {
      const allStats = JSON.parse(localStorage.getItem('mentei_user_stats') || '{}');
      const rankingArray = Object.values(allStats)
        .map((stats: any) => ({
          ...stats,
          wins: stats.battleWins || 0,
          username: stats.username || 'user' + stats.id,
          avatar: stats.avatar || generateRealPersonAvatar(Math.random() > 0.5 ? 'men' : 'women')
        }))
        .sort((a: any, b: any) => (b.wins || 0) - (a.wins || 0))
        .slice(0, 10);
      
      setRankingData(rankingArray);
    };
    
    loadRanking();
    
    // Atualizar ranking a cada 10 segundos
    const interval = setInterval(loadRanking, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const renderTopLiars = () => {
    const topUsers = rankingData.length > 0 ? rankingData.slice(0, 5) : [
      {
        id: 'user1',
        name: 'Carlos Mendes',
        username: 'carlosmendes',
        avatar: generateRealPersonAvatar('men'),
        wins: 132,
        totalBattles: 150
      },
      {
        id: 'user2',
        name: 'Ana Souza',
        username: 'anasouza',
        avatar: generateRealPersonAvatar('women'),
        wins: 98,
        totalBattles: 120
      }
    ];
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FaCrown className="mr-2 text-yellow-500" /> Top Mentirosos
        </h3>
        <div className="space-y-3">
          {topUsers.map((user: any, index: number) => (
            <Link href={`/usuario/${user.username || 'user' + user.id}`} key={user.id || index}>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-3">#{index + 1}</span>
                  <img
                    src={user.avatar || generateRealPersonAvatar(index % 2 === 0 ? 'men' : 'women')}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="font-medium">{user.name || user.username || 'Anônimo'}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{user.wins || 0} vitórias</div>
                  <div className="text-xs text-gray-500">
                    {user.totalBattles || 0} batalhas
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  
  const topBattleWinners = rankingData.length > 0 ? rankingData : [
    {
      id: 'user1',
      name: 'Carlos Mendes',
      username: 'carlosmendes',
      avatar: generateRealPersonAvatar('men'),
      wins: 132,
      level: 'Mentiroso Lendário'
    },
    {
      id: 'user2',
      name: 'Ana Souza',
      username: 'anasouza',
      avatar: generateRealPersonAvatar('women'),
      wins: 98,
      level: 'Mentirosa Épica'
    },
    {
      id: 'user3',
      name: 'Rodrigo Lima',
      username: 'rodrigolima',
      avatar: generateRealPersonAvatar('men'),
      wins: 86,
      level: 'Fabulista Pro'
    },
    {
      id: 'user4',
      name: 'Juliana Costa',
      username: 'julianacosta',
      avatar: generateRealPersonAvatar('women'),
      wins: 72,
      level: 'Contadora de Histórias'
    },
    {
      id: 'user5',
      name: 'Pedro Almeida',
      username: 'pedroalmeida',
      avatar: generateRealPersonAvatar('men'),
      wins: 65,
      level: 'Mentiroso Experiente'
    }
  ];
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo principal - 2 colunas em desktop */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaCrown className="text-yellow-500 mr-2" />
              Batalhas de Mentiras
            </h1>
            
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('battle')}
                className={`px-4 py-2 ${
                  activeTab === 'battle' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Batalhar
              </button>
              <button
                onClick={() => setActiveTab('ranking')}
                className={`px-4 py-2 ${
                  activeTab === 'ranking' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaChartLine className="inline mr-2" />
                Ranking
              </button>
            </div>
          </div>
          
          {activeTab === 'battle' && (
            <BattleMentiras />
          )}
          
          {activeTab === 'ranking' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <FaChartLine className="mr-3" />
                  Ranking de Mentirosos
                </h2>
                <p className="text-purple-100 mt-2">Os maiores fabulistas da plataforma</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {topBattleWinners.map((user, index) => (
                  <Link 
                    key={user.id} 
                    href={`/usuario/${user.username}`}
                    className="block p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="font-bold text-lg text-gray-500 w-8 text-center mr-3">
                        {index + 1}
                      </div>
                      
                      <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center mr-4 overflow-hidden">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 hover:text-purple-600 transition-colors">{user.name}</h3>
                        <p className="text-xs text-gray-500">{user.level}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <FaTrophy className="text-yellow-500 mr-1" />
                        <span className="font-bold text-purple-700">{user.wins}</span>
                        <span className="text-xs text-gray-500 ml-1">vitórias</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3">Como subir no ranking</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>Poste mentiras criativas e absurdas que chamem atenção</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>Quanto mais suas mentiras vencerem batalhas, mais você sobe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>O ranking é atualizado em tempo real</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar com Top Mentirosos - 1 coluna em desktop */}
        <div className="lg:col-span-1">
          {renderTopLiars()}
        </div>
      </div>
    </div>
  );
}