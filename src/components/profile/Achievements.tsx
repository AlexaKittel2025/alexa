'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from '@/lib/firebase';
import { FaTrophy, FaStar, FaLock, FaUnlock, FaMedal, FaCrown, FaGem } from 'react-icons/fa';
import { safeAuth } from '@/utils/safeAuth';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  maxProgress: number;
  completed: boolean;
  date?: Date;
}

interface AchievementsProps {
  userId: string;
}

export default function Achievements({ userId }: AchievementsProps) {
  const [user] = useAuthState(safeAuth);
  const [userLevel, setUserLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(100);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'locked'>('all');
  
  useEffect(() => {
    fetchUserAchievements();
  }, [userId]);
  
  const fetchUserAchievements = async () => {
    try {
      setLoading(true);
      
      // Em um app real, buscaríamos essas informações do Firebase
      // Aqui estamos simulando com dados fictícios
      
      // Dados de nível e experiência
      const userXp = Math.floor(Math.random() * 400) + 100;
      const userLvl = Math.floor(userXp / 100) + 1;
      const nextLevelXp = userLvl * 100;
      
      setXp(userXp);
      setUserLevel(userLvl);
      setXpToNextLevel(nextLevelXp);
      
      // Simular conquistas
      const mockAchievements: Achievement[] = [
        {
          id: 'mentiroso-iniciante',
          name: 'Mentiroso Iniciante',
          description: 'Poste sua primeira mentira',
          icon: <FaTrophy className="text-yellow-500" />,
          level: 'bronze',
          progress: 1,
          maxProgress: 1,
          completed: true,
          date: new Date(Date.now() - 1000000000)
        },
        {
          id: 'mentiroso-amador',
          name: 'Mentiroso Amador',
          description: 'Poste 10 mentiras',
          icon: <FaTrophy className="text-blue-500" />,
          level: 'silver',
          progress: 7,
          maxProgress: 10,
          completed: false
        },
        {
          id: 'mentiroso-profissional',
          name: 'Mentiroso Profissional',
          description: 'Poste 50 mentiras',
          icon: <FaTrophy className="text-purple-500" />,
          level: 'gold',
          progress: 2,
          maxProgress: 50,
          completed: false
        },
        {
          id: 'rei-das-reacoes',
          name: 'Rei das Reações',
          description: 'Receba 100 reações "Quase Acreditei"',
          icon: <FaStar className="text-yellow-500" />,
          level: 'silver',
          progress: 100,
          maxProgress: 100,
          completed: true,
          date: new Date(Date.now() - 500000000)
        },
        {
          id: 'comediante',
          name: 'Comediante',
          description: 'Receba 50 reações "Hahaha"',
          icon: <FaStar className="text-green-500" />,
          level: 'bronze',
          progress: 38,
          maxProgress: 50,
          completed: false
        },
        {
          id: 'vencedor-de-batalhas',
          name: 'Vencedor de Batalhas',
          description: 'Ganhe 20 batalhas de mentiras',
          icon: <FaMedal className="text-amber-700" />,
          level: 'gold',
          progress: 5,
          maxProgress: 20,
          completed: false
        },
        {
          id: 'top-mentiroso',
          name: 'Top Mentiroso',
          description: 'Alcance o top 3 no ranking semanal',
          icon: <FaCrown className="text-yellow-600" />,
          level: 'platinum',
          progress: 0,
          maxProgress: 1,
          completed: false
        },
        {
          id: 'colecao-completa',
          name: 'Colecionador de Emblemas',
          description: 'Desbloqueie 5 emblemas',
          icon: <FaGem className="text-indigo-500" />,
          level: 'gold',
          progress: 2,
          maxProgress: 5,
          completed: false
        }
      ];
      
      setAchievements(mockAchievements);
      setLoading(false);
      
    } catch (error) {
      
      setLoading(false);
    }
  };
  
  const filteredAchievements = achievements.filter(achievement => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return achievement.completed;
    if (activeTab === 'locked') return !achievement.completed;
    return true;
  });
  
  const getLevelTitle = (level: number): string => {
    const titles = [
      'Mentiroso Iniciante',
      'Contador de Lorotas',
      'Fabulista Amador',
      'Criador de Histórias',
      'Mentiroso Experiente',
      'Mestre das Ilusões',
      'Enganador Profissional',
      'Lenda da Mentira',
      'Mito da Lorota',
      'Imperador das Mentiras'
    ];
    
    if (level <= 0) return titles[0];
    if (level > titles.length) return titles[titles.length - 1];
    return titles[level - 1];
  };
  
  const getLevelBadgeColor = (level: number): string => {
    if (level <= 2) return 'from-gray-400 to-gray-500'; // Iniciante
    if (level <= 4) return 'from-blue-400 to-blue-500'; // Intermediário 
    if (level <= 6) return 'from-green-400 to-green-500'; // Avançado
    if (level <= 8) return 'from-purple-400 to-purple-600'; // Expert
    return 'from-yellow-400 to-amber-600'; // Mestre
  };
  
  const getLevelColor = (achievementLevel: string): string => {
    switch (achievementLevel) {
      case 'bronze': return 'text-amber-700';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-500';
      case 'platinum': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return '';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800">Conquistas e Nível</h2>
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-purple-800 flex items-center">
        <FaTrophy className="text-yellow-500 mr-2" />
        Conquistas e Nível
      </h2>
      
      {/* Nível do usuário */}
      <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold">{getLevelTitle(userLevel)}</h3>
            <p className="text-sm text-gray-600">Nível {userLevel}</p>
          </div>
          
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getLevelBadgeColor(userLevel)} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
            {userLevel}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div 
            className="bg-purple-600 h-2.5 rounded-full" 
            style={{ width: `${(xp % xpToNextLevel) / xpToNextLevel * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{xp % xpToNextLevel} XP</span>
          <span>{xpToNextLevel} XP para o nível {userLevel + 1}</span>
        </div>
      </div>
      
      {/* Tabs de conquistas */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-1 ${
              activeTab === 'all'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Todas ({achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-2 px-1 ${
              activeTab === 'completed'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completadas ({achievements.filter(a => a.completed).length})
          </button>
          <button
            onClick={() => setActiveTab('locked')}
            className={`pb-2 px-1 ${
              activeTab === 'locked'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Em progresso ({achievements.filter(a => !a.completed).length})
          </button>
        </div>
      </div>
      
      {/* Lista de conquistas */}
      <div className="space-y-4">
        {filteredAchievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`p-4 rounded-lg border ${
              achievement.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                achievement.completed ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {achievement.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="font-semibold text-gray-800 mr-2">{achievement.name}</h3>
                  <span className={`text-xs font-medium ${getLevelColor(achievement.level)}`}>
                    {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2 flex-1">
                      <div 
                        className={`h-2 rounded-full ${achievement.completed ? 'bg-green-500' : 'bg-purple-500'}`}
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  
                  {achievement.completed ? (
                    <div className="flex items-center ml-4">
                      <FaUnlock className="text-green-500 mr-1" size={12} />
                      <span className="text-xs text-gray-500">{formatDate(achievement.date)}</span>
                    </div>
                  ) : (
                    <div className="ml-4">
                      <FaLock className="text-gray-400" size={12} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 