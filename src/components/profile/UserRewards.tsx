'use client';

import { useState, useEffect } from 'react';
import { FaCrown, FaMedal, FaCoins, FaTrophy, FaLock, FaUnlock } from 'react-icons/fa';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { safeAuth } from '@/utils/safeAuth';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  unlocked: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward: number;
  claimed?: boolean;
}

export default function UserRewards({ userId }: { userId: string }) {
  const [user] = useAuthState(safeAuth);
  const [coins, setCoins] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'badges' | 'achievements'>('badges');
  const [isLoading, setIsLoading] = useState(true);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  
  const isCurrentUser = user?.uid === userId;
  
  useEffect(() => {
    fetchUserData();
  }, [userId]);
  
  const fetchUserData = async () => {
    try {
      // Obter dados do usuário do Firestore
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCoins(userData.coins || 0);
        
        // Em um app real, os badges e conquistas viriam do banco de dados
        // Aqui estamos simulando com dados estáticos
        setBadges(generateBadges(userData.unlockedBadges || []));
        setAchievements(generateAchievements(userData.achievements || {}));
      } else {
        
      }
      
      setIsLoading(false);
    } catch (error) {
      
      setIsLoading(false);
    }
  };
  
  const generateBadges = (unlockedBadges: string[]): Badge[] => {
    return [
      {
        id: 'mentiroso-nivel-100',
        name: 'Mentiroso Nível 100',
        description: 'Para os mentirosos de elite',
        icon: <FaCrown className="text-yellow-500" size={24} />,
        price: 500,
        unlocked: unlockedBadges.includes('mentiroso-nivel-100')
      },
      {
        id: 'contador-mestre',
        name: 'Contador de Histórias',
        description: 'Suas mentiras são verdadeiras obras de arte',
        icon: <FaMedal className="text-blue-500" size={24} />,
        price: 300,
        unlocked: unlockedBadges.includes('contador-mestre')
      },
      {
        id: 'rei-da-mentira',
        name: 'Rei da Mentira',
        description: 'Ninguém mente melhor que você',
        icon: <FaTrophy className="text-purple-500" size={24} />,
        price: 800,
        unlocked: unlockedBadges.includes('rei-da-mentira')
      },
      {
        id: 'mentiroso-colorido',
        name: 'Mentiroso Colorido',
        description: 'Suas mentiras terão um destaque colorido especial',
        icon: <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>,
        price: 250,
        unlocked: unlockedBadges.includes('mentiroso-colorido')
      },
      {
        id: 'campeao-batalhas',
        name: 'Campeão de Batalhas',
        description: 'Venceu mais de 20 batalhas de mentiras',
        icon: <FaCrown className="text-indigo-500" size={24} />,
        price: 400,
        unlocked: unlockedBadges.includes('campeao-batalhas')
      },
    ];
  };
  
  const generateAchievements = (userAchievements: Record<string, any>): Achievement[] => {
    return [
      {
        id: 'primeiras-mentiras',
        title: 'Primeiros Passos',
        description: 'Poste 5 mentiras',
        progress: userAchievements['primeiras-mentiras']?.progress || 0,
        maxProgress: 5,
        completed: userAchievements['primeiras-mentiras']?.completed || false,
        reward: 100
      },
      {
        id: 'mentiroso-serial',
        title: 'Mentiroso em Série',
        description: 'Poste 20 mentiras',
        progress: userAchievements['mentiroso-serial']?.progress || 0,
        maxProgress: 20,
        completed: userAchievements['mentiroso-serial']?.completed || false,
        reward: 200
      },
      {
        id: 'batalhas-mentiras',
        title: 'Juiz de Mentiras',
        description: 'Participe de 10 batalhas de mentiras',
        progress: userAchievements['batalhas-mentiras']?.progress || 0,
        maxProgress: 10,
        completed: userAchievements['batalhas-mentiras']?.completed || false,
        reward: 150
      },
      {
        id: 'reacoes-epicas',
        title: 'Mentiroso Épico',
        description: 'Receba 50 reações "Mentira épica"',
        progress: userAchievements['reacoes-epicas']?.progress || 0,
        maxProgress: 50,
        completed: userAchievements['reacoes-epicas']?.completed || false,
        reward: 300
      },
      {
        id: 'detector-mentiras',
        title: 'Detector de Mentiras',
        description: 'Acerte 10 questões no Teste de Verdade',
        progress: userAchievements['detector-mentiras']?.progress || 0,
        maxProgress: 10,
        completed: userAchievements['detector-mentiras']?.completed || false,
        reward: 250
      },
    ];
  };
  
  const unlockBadge = async (badge: Badge) => {
    if (!user || !isCurrentUser || badge.unlocked) return;
    
    if (coins < badge.price) {
      alert('Você não tem moedas suficientes!');
      return;
    }
    
    try {
      // Atualizar no Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        coins: increment(-badge.price),
        [`unlockedBadges.${badge.id}`]: true
      });
      
      // Atualizar estado local
      setCoins(prev => prev - badge.price);
      setBadges(prev => 
        prev.map(b => 
          b.id === badge.id ? { ...b, unlocked: true } : b
        )
      );
      
      // Mostrar animação
      setUnlockedBadge(badge);
      setShowUnlockAnimation(true);
      
      // Esconder animação após alguns segundos
      setTimeout(() => {
        setShowUnlockAnimation(false);
        setUnlockedBadge(null);
      }, 3000);
      
    } catch (error) {
      
      alert('Ocorreu um erro ao desbloquear o emblema. Tente novamente.');
    }
  };
  
  const claimReward = async (achievement: Achievement) => {
    if (!user || !isCurrentUser || !achievement.completed) return;
    
    try {
      // Atualizar no Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        coins: increment(achievement.reward),
        [`achievements.${achievement.id}.claimed`]: true
      });
      
      // Atualizar estado local
      setCoins(prev => prev + achievement.reward);
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievement.id ? { ...a, claimed: true } : a
        )
      );
      
    } catch (error) {
      
      alert('Ocorreu um erro ao resgatar a recompensa. Tente novamente.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800">Recompensas</h2>
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-purple-800">Recompensas</h2>
        <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
          <FaCoins className="text-yellow-500 mr-2" />
          <span className="font-semibold">{coins} moedas</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-2 px-4 ${
              activeTab === 'badges'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Emblemas
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-2 px-4 ${
              activeTab === 'achievements'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Conquistas
          </button>
        </div>
      </div>
      
      {activeTab === 'badges' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`p-4 rounded-lg border ${badge.unlocked 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 hover:border-purple-200'}`}
            >
              <div className="flex items-center">
                <div className="mr-3 p-2 bg-white rounded-full">
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    {badge.name}
                    {badge.unlocked && <FaUnlock className="text-green-500 ml-2" size={14} />}
                  </h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              </div>
              
              {!badge.unlocked && isCurrentUser && (
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <FaCoins className="text-yellow-500 mr-1" size={14} />
                    <span className="text-sm">{badge.price}</span>
                  </div>
                  <button
                    onClick={() => unlockBadge(badge)}
                    disabled={coins < badge.price}
                    className={`px-3 py-1 rounded text-sm ${
                      coins >= badge.price
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Desbloquear
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.completed ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold flex items-center">
                    {achievement.title}
                    {achievement.completed && (
                      <FaTrophy className="text-yellow-500 ml-2" size={14} />
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-purple-500 rounded-full"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <FaCoins className="text-yellow-500 mr-1" size={14} />
                    <span className="text-sm">{achievement.reward}</span>
                  </div>
                  
                  {achievement.completed && !achievement.claimed && isCurrentUser && (
                    <button
                      onClick={() => claimReward(achievement)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Resgatar
                    </button>
                  )}
                  
                  {achievement.claimed && (
                    <span className="text-sm text-green-600">Resgatado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Animação de desbloqueio */}
      {showUnlockAnimation && unlockedBadge && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg transform animate-bounce">
            <div className="text-center">
              <div className="text-4xl mb-4">{unlockedBadge.icon}</div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">
                Emblema desbloqueado!
              </h3>
              <p className="font-medium mb-4">{unlockedBadge.name}</p>
              <p className="text-gray-600">{unlockedBadge.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 