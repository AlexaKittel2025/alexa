'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaTrophy, FaLevelUpAlt } from 'react-icons/fa';
import { loadGamificationData, UserLevel } from '@/lib/gamification';

interface UserLevelProgressProps {
  userId: string;
}

export default function UserLevelProgress({ userId }: UserLevelProgressProps) {
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 1,
    xp: 0,
    xpToNextLevel: 50,
    title: 'Mentiroso Iniciante'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = () => {
    try {
      const gamificationData = loadGamificationData(userId);
      setUserLevel(gamificationData.level);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (level: number): string => {
    if (level <= 10) return 'from-gray-400 to-gray-600';
    if (level <= 25) return 'from-green-400 to-green-600';
    if (level <= 50) return 'from-blue-400 to-blue-600';
    if (level <= 75) return 'from-purple-400 to-purple-600';
    if (level <= 100) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getProgressColor = (level: number): string => {
    if (level <= 10) return 'bg-gray-500';
    if (level <= 25) return 'bg-green-500';
    if (level <= 50) return 'bg-blue-500';
    if (level <= 75) return 'bg-purple-500';
    if (level <= 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  const progressPercentage = (userLevel.xp / userLevel.xpToNextLevel) * 100;

  return (
    <div className="relative bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getLevelColor(userLevel.level)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {userLevel.level}
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-gray-800">{userLevel.title}</h3>
            <p className="text-sm text-gray-600">Nível {userLevel.level}</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaStar size={20} />
        </button>
      </div>

      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`${getProgressColor(userLevel.level)} h-3 rounded-full transition-all duration-300 relative`}
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute -right-1 -top-1 w-5 h-5 bg-white rounded-full border-2 border-current flex items-center justify-center">
              <div className="w-2 h-2 bg-current rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">{userLevel.xp} XP</span>
          <span className="text-xs text-gray-600">{userLevel.xpToNextLevel} XP</span>
        </div>
      </div>

      {showInfo && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <FaLevelUpAlt className="mr-2 text-purple-500" />
            Próximos Níveis
          </h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div>Nível {userLevel.level + 1}: {userLevel.xpToNextLevel} XP</div>
            <div>Nível {userLevel.level + 2}: {Math.pow(userLevel.level + 1, 2) * 50} XP</div>
            <div>Nível {userLevel.level + 3}: {Math.pow(userLevel.level + 2, 2) * 50} XP</div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
        <FaTrophy className="mr-1 text-yellow-500" />
        <span>{userLevel.xpToNextLevel - userLevel.xp} XP para o próximo nível</span>
      </div>
    </div>
  );
}