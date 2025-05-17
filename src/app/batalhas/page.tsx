'use client';

import { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import BattleMentiras from '@/components/Game/BattleMentiras';
import { FaCrown, FaTrophy, FaChartLine, FaUsers } from 'react-icons/fa';

export default function BatalhasPage() {
  const [activeTab, setActiveTab] = useState<'battle' | 'ranking'>('battle');
  
  const topBattleWinners = [
    {
      id: 'user1',
      name: 'Carlos Mendes',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      wins: 124,
      level: 'Mestre Mentiroso'
    },
    {
      id: 'user2',
      name: 'Ana Beatriz',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      wins: 98,
      level: 'Mentirosa Épica'
    },
    {
      id: 'user3',
      name: 'Rodrigo Lima',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      wins: 86,
      level: 'Fabulista Pro'
    },
    {
      id: 'user4',
      name: 'Juliana Costa',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      wins: 72,
      level: 'Contadora de Histórias'
    },
    {
      id: 'user5',
      name: 'Pedro Almeida',
      avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
      wins: 65,
      level: 'Mentiroso Experiente'
    }
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
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
              Ranking
            </button>
          </div>
        </div>
        
        {activeTab === 'battle' ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3 text-purple-800">Como funcionam as batalhas?</h2>
              <p className="text-gray-600 mb-4">
                Duas mentiras são apresentadas lado a lado. Vote na que você achou mais criativa, absurda ou engraçada!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-purple-600 text-xl mb-2">
                    <FaUsers />
                  </div>
                  <h3 className="font-medium mb-1">Vote nas melhores</h3>
                  <p className="text-sm text-gray-600">Avalie mentiras de outros usuários</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 text-xl mb-2">
                    <FaChartLine />
                  </div>
                  <h3 className="font-medium mb-1">Ganhe pontos</h3>
                  <p className="text-sm text-gray-600">Suas mentiras que vencem batalhas ganham pontos</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-600 text-xl mb-2">
                    <FaTrophy />
                  </div>
                  <h3 className="font-medium mb-1">Suba no ranking</h3>
                  <p className="text-sm text-gray-600">Acumule vitórias para aparecer no ranking</p>
                </div>
              </div>
            </div>
            
            <BattleMentiras />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-purple-700 text-white">
              <h2 className="text-xl font-semibold">Top Vencedores de Batalhas</h2>
              <p className="text-sm text-purple-200">Os mentirosos que mais vencem batalhas</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {topBattleWinners.map((user, index) => (
                <div key={user.id} className="p-4 hover:bg-gray-50">
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
                      <h3 className="font-medium text-gray-800">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.level}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <FaTrophy className="text-yellow-500 mr-1" />
                      <span className="font-bold text-purple-700">{user.wins}</span>
                      <span className="text-xs text-gray-500 ml-1">vitórias</span>
                    </div>
                  </div>
                </div>
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
                  <span>O ranking é atualizado diariamente</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 