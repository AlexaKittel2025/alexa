'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaCrown, FaTrophy, FaFire, FaDice, FaHistory, FaTimes } from 'react-icons/fa';
import { GiBoxingGlove as FaGlove } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { onBattleWon, onBattleLost, checkAchievements } from '@/lib/gamification';
import { triggerGamificationEvent } from '@/components/GamificationNotification';
import BattleStats from './BattleStats';
import BattleHistory from './BattleHistory';
import BattleCard from './BattleCard';
import BattleEntryModal from './BattleEntryModal';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  battleScore?: number;
  likes?: number;
  comments?: number;
}

interface Battle {
  id: string;
  postA: Post | null;
  postB: Post | null;
  createdAt: string;
  votesA: number;
  votesB: number;
  winnerId?: string;
  status: 'waiting' | 'active' | 'finished';
}

interface BattleStats {
  battleWins: number;
  totalBattles: number;
  currentStreak: number;
  bestStreak: number;
  lastBattle: string | null;
  winRate: number;
}

export default function BattleMentiras() {
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [userStats, setUserStats] = useState<BattleStats>({
    totalBattles: 0,
    battleWins: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastBattle: null
  });
  const [battleHistory, setBattleHistory] = useState<any[]>([]);
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();

  // Carregar batalha ativa
  useEffect(() => {
    if (!userLoading) {
      loadActiveBattle();
      loadUserBattleStats();
      loadBattleHistory();
    }
    
    // Atualizar a cada 10 segundos
    const interval = setInterval(() => {
      if (!userLoading) {
        loadActiveBattle();
        loadUserBattleStats();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user, userLoading]);

  const loadActiveBattle = async () => {
    try {
      const response = await fetch('/api/battles?type=active');
      
      if (response.ok) {
        const battle = await response.json();
        setCurrentBattle(battle);
        
        // Verificar se o usuário já votou
        if (battle && user) {
          const voteResponse = await fetch(`/api/battles/vote?battleId=${battle.id}`);
          if (voteResponse.ok) {
            const { canVote } = await voteResponse.json();
            setVoted(!canVote);
          }
        }
      } else {
        setCurrentBattle(null);
      }
    } catch (error) {
      console.error('Erro ao carregar batalha ativa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserBattleStats = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/battles');
      
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadBattleHistory = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/battles?type=history');
      
      if (response.ok) {
        const history = await response.json();
        setBattleHistory(history);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleBattleEntry = async (content: string, imageUrl?: string) => {
    if (!user) {
      alert('Você precisa estar logado para participar!');
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch('/api/battles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          content,
          imageUrl
        }),
      });
      
      if (response.ok) {
        const battle = await response.json();
        setCurrentBattle(battle);
        setShowEntryModal(false);
        
        // Recarregar estatísticas
        loadUserBattleStats();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar batalha');
      }
    } catch (error) {
      console.error('Erro ao entrar na batalha:', error);
      alert('Erro ao entrar na batalha');
    }
  };

  const handleVote = async (postId: string) => {
    if (!currentBattle || voted || !user) return;
    
    try {
      const response = await fetch('/api/battles/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          battleId: currentBattle.id,
          postId
        }),
      });
      
      if (response.ok) {
        const updatedBattle = await response.json();
        setCurrentBattle(updatedBattle);
        setVoted(true);
        
        // Atualizar estatísticas e verificar conquistas
        loadUserBattleStats();
        
        // Notificar sobre vitória/derrota se a batalha terminou
        if (updatedBattle.status === 'finished') {
          if (updatedBattle.winnerId === user.id) {
            onBattleWon(user.id);
            triggerGamificationEvent('battle-win', { 
              title: 'Vitória!', 
              description: 'Você venceu a batalha!' 
            });
          } else if (currentBattle.postA?.authorId === user.id || currentBattle.postB?.authorId === user.id) {
            onBattleLost(user.id);
          }
          
          // Verificar conquistas
          const unlockedAchievements = checkAchievements(user.id);
          unlockedAchievements.forEach(achievement => {
            triggerGamificationEvent('achievement', achievement);
          });
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao votar');
      }
    } catch (error) {
      console.error('Erro ao votar:', error);
      alert('Erro ao votar');
    }
  };

  const startNewBattle = () => {
    setShowEntryModal(true);
  };

  if (userLoading) {
    return (
      <div className="text-center py-8">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">Você precisa estar logado para participar das batalhas!</p>
        <button 
          onClick={() => router.push('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header com Estatísticas */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FaGlove className="text-4xl text-red-500" />
          <h1 className="text-3xl font-bold">Arena de Batalhas</h1>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FaHistory />
            Histórico
          </button>
          
          <button
            onClick={startNewBattle}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaDice />
            Nova Batalha
          </button>
        </div>
      </div>

      {/* Estatísticas do Usuário */}
      <BattleStats stats={userStats} />

      {/* Área de Batalha */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        {!currentBattle || currentBattle.status === 'waiting' ? (
          <div className="text-center py-12">
            <FaGlove className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {currentBattle ? 'Aguardando Oponente' : 'Nenhuma Batalha Ativa'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {currentBattle 
                ? 'Aguardando outro gladiador entrar na arena...'
                : 'Comece uma nova batalha ou aguarde a próxima!'}
            </p>
            
            {!currentBattle && (
              <button
                onClick={startNewBattle}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Iniciar Nova Batalha
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                Batalha Ativa
              </h2>
              
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentBattle.votesA + currentBattle.votesB} votos
                </span>
                
                {currentBattle.status === 'finished' && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                    Finalizada
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Post A */}
              <div className="relative">
                <BattleCard
                  post={currentBattle.postA!}
                  onVote={() => handleVote(currentBattle.postA!.id)}
                  voted={voted}
                  winner={currentBattle.winnerId === currentBattle.postA?.authorId}
                  disabled={voted || currentBattle.status === 'finished'}
                  position="left"
                />
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="text-4xl font-bold text-red-500">VS</div>
                  {currentBattle.status === 'active' && (
                    <FaFire className="text-2xl text-orange-500 absolute -top-6 left-1/2 -translate-x-1/2 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Post B */}
              <div className="relative">
                <BattleCard
                  post={currentBattle.postB!}
                  onVote={() => handleVote(currentBattle.postB!.id)}
                  voted={voted}
                  winner={currentBattle.winnerId === currentBattle.postB?.authorId}
                  disabled={voted || currentBattle.status === 'finished'}
                  position="right"
                />
              </div>
            </div>

            {voted && currentBattle.status === 'active' && (
              <div className="text-center mt-6">
                <p className="text-green-500 font-semibold">
                  ✓ Voto registrado! Aguardando resultado...
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Histórico de Batalhas */}
      {showHistory && (
        <BattleHistory 
          battles={battleHistory}
          userId={user.id}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Modal de Nova Entrada */}
      {showEntryModal && (
        <BattleEntryModal
          onSubmit={handleBattleEntry}
          onClose={() => setShowEntryModal(false)}
        />
      )}
    </div>
  );
}