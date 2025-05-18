'use client';

import { useState, useEffect } from 'react';
import { FaTrophy, FaLock, FaUnlock, FaCoins, FaStar, FaMedal, FaCrown, FaGem } from 'react-icons/fa';
import { loadGamificationData, Achievement, Badge, unlockBadge } from '@/lib/gamification';
import { triggerGamificationEvent } from './GamificationNotification';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface AchievementsSystemProps {
  userId: string;
}

export default function AchievementsSystem({ userId }: AchievementsSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [coins, setCoins] = useState(0);
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>('achievements');
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');
  const { user } = useCurrentUser();
  
  const isCurrentUser = user?.id === userId;

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = () => {
    try {
      setIsLoading(true);
      const gamificationData = loadGamificationData(userId);
      setAchievements(gamificationData.achievements);
      setBadges(gamificationData.badges);
      setCoins(gamificationData.coins);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockBadge = (badge: Badge) => {
    if (!isCurrentUser || badge.unlocked || coins < badge.cost) return;

    if (unlockBadge(userId, badge.id)) {
      // Recarregar dados
      loadUserData();
      
      // Disparar notificação
      triggerGamificationEvent('badge', badge);
    } else {
      alert('Você não tem moedas suficientes!');
    }
  };

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'bronze': return 'text-amber-700';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-500';
      case 'platinum': return 'text-purple-600';
      case 'diamond': return 'text-blue-500';
      default: return 'text-gray-600';
    }
  };

  const getTierBgColor = (tier: string): string => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100';
      case 'silver': return 'bg-gray-100';
      case 'gold': return 'bg-yellow-100';
      case 'platinum': return 'bg-purple-100';
      case 'diamond': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  };

  const getRarityColor = (tier: string): string => {
    switch (tier) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-orange-300 bg-orange-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filterCategory !== 'all' && achievement.category !== filterCategory) return false;
    if (filterTier !== 'all' && achievement.tier !== filterTier) return false;
    return true;
  });

  const totalUnlocked = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const completionPercentage = (totalUnlocked / totalAchievements) * 100;

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800">Conquistas e Badges</h2>
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-purple-800 flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          Conquistas e Badges
        </h2>
        <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
          <FaCoins className="text-yellow-500 mr-2" />
          <span className="font-semibold">{coins} moedas</span>
        </div>
      </div>

      {/* Progresso geral */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
          <span className="text-sm font-medium text-purple-700">
            {totalUnlocked}/{totalAchievements} Conquistas
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-2 px-4 ${
              activeTab === 'achievements'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaMedal className="inline mr-2" />
            Conquistas
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-2 px-4 ${
              activeTab === 'badges'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaGem className="inline mr-2" />
            Badges
          </button>
        </div>
      </div>

      {/* Filtros */}
      {activeTab === 'achievements' && (
        <div className="mb-4 flex space-x-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value="all">Todas Categorias</option>
            <option value="posts">Posts</option>
            <option value="battles">Batalhas</option>
            <option value="engagement">Engajamento</option>
            <option value="special">Especiais</option>
          </select>
          
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value="all">Todos os Níveis</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Prata</option>
            <option value="gold">Ouro</option>
            <option value="platinum">Platina</option>
            <option value="diamond">Diamante</option>
          </select>
        </div>
      )}

      {/* Conteúdo */}
      {activeTab === 'achievements' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                    achievement.unlocked ? 'bg-green-100' : 'bg-gray-200'
                  }`}
                >
                  {achievement.unlocked ? (
                    <FaUnlock className="text-green-600" />
                  ) : (
                    <FaLock className="text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="text-lg mr-2">{achievement.icon}</span>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${getTierBgColor(
                        achievement.tier
                      )} ${getTierColor(achievement.tier)}`}
                    >
                      {achievement.tier}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Progresso</span>
                      <span className="text-xs text-gray-600">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        style={{
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {achievement.unlocked && (
                    <div className="mt-3 flex items-center text-xs text-gray-600">
                      <span className="flex items-center mr-3">
                        <FaCoins className="text-yellow-500 mr-1" />
                        +{achievement.coinReward}
                      </span>
                      <span className="flex items-center">
                        <FaStar className="text-purple-500 mr-1" />
                        +{achievement.xpReward} XP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 ${getRarityColor(badge.tier)}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-bold text-gray-800">{badge.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{badge.description}</p>

                {badge.effects && (
                  <div className="mt-3 space-y-1">
                    {badge.effects.map((effect, index) => (
                      <div key={index} className="text-xs text-purple-600">
                        ✨ {effect}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  {badge.unlocked ? (
                    <div className="flex items-center justify-center text-green-600">
                      <FaUnlock className="mr-1" />
                      <span className="text-sm font-medium">Desbloqueado</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <FaCoins className="text-yellow-500 mr-1" />
                        <span className="font-medium">{badge.cost}</span>
                      </div>
                      {isCurrentUser && (
                        <button
                          onClick={() => handleUnlockBadge(badge)}
                          disabled={coins < badge.cost}
                          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                            coins >= badge.cost
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Desbloquear
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}