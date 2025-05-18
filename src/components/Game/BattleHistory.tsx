'use client';

import { FaTrophy, FaTimesCircle, FaClock } from 'react-icons/fa';

interface Battle {
  id: string;
  date: string;
  opponentName: string;
  opponentAvatar?: string;
  result: 'win' | 'loss';
  yourPost: string;
  opponentPost: string;
  votes: {
    you: number;
    opponent: number;
  };
}

interface BattleHistoryProps {
  battles: Battle[];
}

export default function BattleHistory({ battles }: BattleHistoryProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <FaClock className="mr-2 text-purple-600" />
        Histórico de Batalhas
      </h3>

      {battles.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          Você ainda não participou de nenhuma batalha
        </p>
      ) : (
        <div className="space-y-4">
          {battles.map((battle) => (
            <div
              key={battle.id}
              className={`relative rounded-lg border-2 p-4 transition-all ${
                battle.result === 'win'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              {/* Resultado */}
              <div className="absolute -top-3 -right-3">
                {battle.result === 'win' ? (
                  <div className="bg-green-500 text-white rounded-full p-2">
                    <FaTrophy className="text-sm" />
                  </div>
                ) : (
                  <div className="bg-red-500 text-white rounded-full p-2">
                    <FaTimesCircle className="text-sm" />
                  </div>
                )}
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-100">
                    {battle.opponentAvatar ? (
                      <img
                        src={battle.opponentAvatar}
                        alt={battle.opponentName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-800 font-bold">
                        {battle.opponentName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      vs {battle.opponentName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(battle.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">
                    {battle.votes.you} - {battle.votes.opponent}
                  </p>
                  <p className="text-xs text-gray-600">votos</p>
                </div>
              </div>

              {/* Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className={`p-3 rounded-lg ${
                  battle.result === 'win' ? 'bg-green-100' : 'bg-white'
                }`}>
                  <p className="font-medium text-gray-700 mb-1">Sua mentira:</p>
                  <p className="text-gray-600">
                    {battle.yourPost.length > 60
                      ? `${battle.yourPost.substring(0, 60)}...`
                      : battle.yourPost}
                  </p>
                </div>
                
                <div className={`p-3 rounded-lg ${
                  battle.result === 'loss' ? 'bg-red-100' : 'bg-white'
                }`}>
                  <p className="font-medium text-gray-700 mb-1">Mentira do oponente:</p>
                  <p className="text-gray-600">
                    {battle.opponentPost.length > 60
                      ? `${battle.opponentPost.substring(0, 60)}...`
                      : battle.opponentPost}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}