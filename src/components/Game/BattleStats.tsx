'use client';

import { FaTrophy, FaFire, FaChartLine, FaMedal, FaCalendarAlt } from 'react-icons/fa';

interface BattleStatsProps {
  totalBattles: number;
  wins: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  lastBattle?: string | null;
}

export default function BattleStats({
  totalBattles,
  wins,
  winRate,
  currentStreak,
  bestStreak,
  lastBattle
}: BattleStatsProps) {
  const stats = [
    {
      icon: FaTrophy,
      label: 'Vitórias',
      value: wins,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: FaChartLine,
      label: 'Taxa de Vitória',
      value: `${winRate}%`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FaFire,
      label: 'Sequência Atual',
      value: currentStreak,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: FaMedal,
      label: 'Melhor Sequência',
      value: bestStreak,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <FaChartLine className="mr-2 text-purple-600" />
        Suas Estatísticas
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-lg p-4 text-center`}>
              <Icon className={`${stat.color} text-2xl mx-auto mb-2`} />
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Total de Batalhas: <span className="font-bold text-gray-800">{totalBattles}</span>
          </span>
          {lastBattle && (
            <span className="text-gray-500 flex items-center">
              <FaCalendarAlt className="mr-1" />
              Última batalha: {new Date(lastBattle).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      {currentStreak >= 5 && (
        <div className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-3 text-center">
          <p className="font-bold">🔥 Você está em chamas! {currentStreak} vitórias seguidas!</p>
        </div>
      )}
    </div>
  );
}