import React, { useState, useEffect } from 'react';
import { User, Achievement } from '../types';
import { TrophyIcon, SparklesIcon, StarIcon, ArrowUpIcon } from '@heroicons/react/outline';

interface AchievementsSystemProps {
  user: User;
  onLevelUp?: (newLevel: number) => void;
  onNewAchievement?: (achievement: Achievement) => void;
}

// Níveis e pontos necessários
const LEVELS_CONFIG = [
  { level: 1, title: 'Mentiroso Iniciante', points: 0 },
  { level: 2, title: 'Mentiroso Casual', points: 100 },
  { level: 3, title: 'Mentiroso Frequente', points: 300 },
  { level: 4, title: 'Mentiroso Expert', points: 600 },
  { level: 5, title: 'Mentiroso Profissional', points: 1000 },
  { level: 6, title: 'Mentiroso Master', points: 1500 },
  { level: 7, title: 'Mentiroso Elite', points: 2100 },
  { level: 8, title: 'Grande Mentiroso', points: 2800 },
  { level: 9, title: 'Mentiroso Lendário', points: 3600 },
  { level: 10, title: 'Rei das Mentiras', points: 4500 }
];

// Conquistas disponíveis no sistema
const AVAILABLE_ACHIEVEMENTS = [
  {
    id: 'first-post',
    title: 'Primeiro Contador',
    description: 'Publicou sua primeira mentira!',
    icon: '🎭',
    points: 25
  },
  {
    id: 'reactions-collector',
    title: 'Colecionador de Reações',
    description: 'Recebeu mais de 10 reações em uma única mentira!',
    icon: '🔥',
    points: 50
  },
  {
    id: 'consecutive-days',
    title: 'Mentiroso Dedicado',
    description: 'Entrou no aplicativo por 7 dias consecutivos',
    icon: '📆',
    points: 75
  },
  {
    id: 'comments-100',
    title: 'Comentarista',
    description: 'Recebeu mais de 100 comentários em suas mentiras',
    icon: '💬',
    points: 100
  },
  {
    id: 'follower-magnet',
    title: 'Magneto de Seguidores',
    description: 'Conseguiu 50 seguidores',
    icon: '🧲',
    points: 150
  },
  {
    id: 'battle-winner',
    title: 'Vencedor de Batalha',
    description: 'Ganhou sua primeira batalha de mentiras',
    icon: '⚔️',
    points: 200
  },
  {
    id: 'pro-mentor',
    title: 'Mentor PRO',
    description: 'Se tornou um usuário PRO',
    icon: '👑',
    points: 250
  },
  {
    id: 'top-liar',
    title: 'Top Mentiroso',
    description: 'Entrou no top 10 do Hall da Fama',
    icon: '🏆',
    points: 500
  },
  {
    id: 'professional-liar',
    title: 'Mentiroso Profissional',
    description: 'Alcançou o nível 5',
    icon: '⭐',
    points: 300
  },
  {
    id: 'legendary-liar',
    title: 'Mentiroso Lendário',
    description: 'Alcançou o nível 10',
    icon: '🌟',
    points: 1000
  }
];

const calculateLevel = (points: number): number => {
  let level = 1;
  for (const config of LEVELS_CONFIG) {
    if (points >= config.points) {
      level = config.level;
    } else {
      break;
    }
  }
  return level;
};

const AchievementsSystem: React.FC<AchievementsSystemProps> = ({ 
  user: userProp, 
  onLevelUp, 
  onNewAchievement 
}) => {
  // Use a extended user object with optional achievements
  const user = userProp as User & { achievements: Achievement[] };
  
  const [userPoints, setUserPoints] = useState(user.points || 0);
  const [userLevel, setUserLevel] = useState(user.level || 1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showNewAchievement, setShowNewAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  // Calcular nível com base nos pontos
  useEffect(() => {
    const calculatedLevel = calculateLevel(userPoints);
    
    if (calculatedLevel > userLevel) {
      setUserLevel(calculatedLevel);
      setShowLevelUp(true);
      
      if (onLevelUp) {
        onLevelUp(calculatedLevel);
      }
      
      // Verificar se ganhou conquista de nível
      if (calculatedLevel === 5) {
        unlockAchievement('professional-liar');
      } else if (calculatedLevel === 10) {
        unlockAchievement('legendary-liar');
      }
    }
  }, [user.points, userLevel]);
  
  // Simular desbloqueio de conquista (em um caso real, isso seria chamado por serviços específicos)
  const unlockAchievement = (achievementId: string) => {
    const achievement = AVAILABLE_ACHIEVEMENTS.find(a => a.id === achievementId);
    
    if (achievement) {
      const hasAchievement = (user.achievements || []).some(a => a.id === achievementId) || false;
      
      if (!hasAchievement) {
        const newAchievementObj: Achievement = {
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          earnedAt: new Date().toISOString()
        };
        
        setNewAchievement(newAchievementObj);
        setShowNewAchievement(true);
        
        // Adicionar pontos pela conquista
        setUserPoints(prev => prev + achievement.points);
        
        if (onNewAchievement) {
          onNewAchievement(newAchievementObj);
        }
      }
    }
  };
  
  // Encontrar o próximo nível
  const getNextLevel = () => {
    const currentLevelConfig = LEVELS_CONFIG.find(config => config.level === userLevel);
    const nextLevelConfig = LEVELS_CONFIG.find(config => config.level === userLevel + 1);
    
    if (!currentLevelConfig || !nextLevelConfig) {
      return { current: userLevel, next: userLevel, pointsRequired: 0, progress: 100 };
    }
    
    const pointsForCurrentLevel = currentLevelConfig.points;
    const pointsForNextLevel = nextLevelConfig.points;
    const pointsRequired = pointsForNextLevel - pointsForCurrentLevel;
    const pointsEarned = userPoints - pointsForCurrentLevel;
    const progress = Math.min(Math.round((pointsEarned / pointsRequired) * 100), 100);
    
    return {
      current: userLevel,
      next: userLevel + 1,
      pointsRequired,
      pointsEarned,
      pointsForNextLevel,
      progress
    };
  };
  
  const nextLevelInfo = getNextLevel();
  const userTitle = LEVELS_CONFIG.find(config => config.level === userLevel)?.title || 'Mentiroso';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold dark:text-white">Nível e Conquistas</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{userPoints} pontos</span>
      </div>
      
      {/* Nível Atual */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-2">
            <StarIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Nível</span>
            <h4 className="font-bold dark:text-white">{userLevel} - {userTitle}</h4>
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${nextLevelInfo.progress}%` }}
          ></div>
        </div>
        
        {userLevel < 10 && (
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{nextLevelInfo.pointsEarned || 0} / {nextLevelInfo.pointsRequired || 0} pontos</span>
            <span>Nível {nextLevelInfo.next}</span>
          </div>
        )}
        
        {userLevel === 10 && (
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            Você atingiu o nível máximo!
          </div>
        )}
      </div>
      
      {/* Últimas Conquistas */}
      <div>
        <h4 className="text-sm font-semibold mb-3 dark:text-white flex items-center">
          <TrophyIcon className="w-4 h-4 mr-1" />
          Conquistas Recentes
        </h4>
        
        <div className="space-y-3">
          {(user.achievements || [])?.length > 0 ? (
            (user.achievements || []).slice(0, 3).map(achievement => (
              <div 
                key={achievement.id} 
                className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-2xl mr-2">{achievement.icon}</span>
                <div>
                  <h5 className="text-sm font-medium dark:text-white">{achievement.title}</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhuma conquista desbloqueada ainda. Continue interagindo!
            </p>
          )}
        </div>
        
        {(user.achievements || [])?.length > 3 && (
          <button className="text-primary text-sm font-medium mt-3 w-full text-center">
            Ver todas ({(user.achievements || []).length})
          </button>
        )}
      </div>
      
      {/* Modal de Level Up */}
      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full text-center animate-bounce-in">
            <div className="mb-4">
              <div className="mx-auto w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <ArrowUpIcon className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Nível {userLevel}!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Parabéns! Você atingiu o nível {userLevel} e agora é um 
              <span className="font-medium"> {userTitle}</span>!
            </p>
            <button 
              className="bg-primary text-white px-6 py-2 rounded-lg"
              onClick={() => setShowLevelUp(false)}
            >
              Ótimo!
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de Nova Conquista */}
      {showNewAchievement && newAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full text-center animate-bounce-in">
            <div className="mb-4">
              <div className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <span className="text-4xl">{newAchievement.icon}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Nova Conquista!</h3>
            <h4 className="text-xl font-semibold mb-2 text-primary">{newAchievement.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {newAchievement.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              +{AVAILABLE_ACHIEVEMENTS.find(a => a.id === newAchievement.id)?.points || 0} pontos
            </p>
            <button 
              className="bg-primary text-white px-6 py-2 rounded-lg"
              onClick={() => setShowNewAchievement(false)}
            >
              Incrível!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsSystem; 