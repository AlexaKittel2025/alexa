'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaCrown, FaTrophy, FaFire, FaDice, FaHistory, FaTimes } from 'react-icons/fa';
import { GiBoxingGlove as FaGlove } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { saveBattleVote, getBattleVote, saveUserStats, loadUserStats } from '@/utils/persistenceUtils';
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
  expiresAt: string;
  votesA: number;
  votesB: number;
  vencedorId?: string;
  participantes: string[];
  status: 'waiting' | 'active' | 'finished';
}

export default function BattleMentiras() {
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [userStats, setUserStats] = useState({
    totalBattles: 0,
    wins: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastBattle: null
  });
  const [battleHistory, setBattleHistory] = useState<any[]>([]);
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();

  useEffect(() => {
    loadActiveBattle();
    loadUserBattleStats();
    loadBattleHistory();
    
    // Atualizar a cada 10 segundos para mudanças mais rápidas
    const interval = setInterval(() => {
      loadActiveBattle();
      loadUserBattleStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user]);

  const loadActiveBattle = async () => {
    try {
      // Verificar se há batalha ativa no localStorage
      const activeBattle = localStorage.getItem('activeBattle');
      
      if (activeBattle) {
        const battle = JSON.parse(activeBattle);
        
        // Verificar se a batalha ainda é válida (não expirou)
        if (new Date(battle.expiresAt) > new Date()) {
          setCurrentBattle(battle);
          
          // Verificar se o usuário já votou
          if (user && battle.participantes.includes(user.id)) {
            setVoted(true);
          }
        } else {
          // Batalha expirou, limpar
          localStorage.removeItem('activeBattle');
          setCurrentBattle(null);
        }
      } else {
        // Não há batalha ativa
        setCurrentBattle(null);
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserBattleStats = async () => {
    if (user) {
      try {
        // Primeiro tentar buscar da API
        const response = await fetch('/api/battles', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const apiStats = await response.json();
          setUserStats({
            totalBattles: apiStats.totalBattles || 0,
            wins: apiStats.battleWins || 0,
            winRate: apiStats.winRate || 0,
            currentStreak: apiStats.currentStreak || 0,
            bestStreak: apiStats.bestStreak || 0,
            lastBattle: apiStats.lastBattle || null
          });
        } else {
          // Fallback para localStorage se a API falhar
          const stats = loadUserStats(user.id) || {};
          const totalBattles = stats.totalBattlesVoted || 0;
          const wins = stats.battleWins || 0;
          const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;
          
          setUserStats({
            totalBattles,
            wins,
            winRate,
            currentStreak: stats.currentStreak || 0,
            bestStreak: stats.bestStreak || 0,
            lastBattle: stats.lastBattle || null
          });
        }
      } catch (error) {
        
        // Usar localStorage como fallback
        const stats = loadUserStats(user.id) || {};
        const totalBattles = stats.totalBattlesVoted || 0;
        const wins = stats.battleWins || 0;
        const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;
        
        setUserStats({
          totalBattles,
          wins,
          winRate,
          currentStreak: stats.currentStreak || 0,
          bestStreak: stats.bestStreak || 0,
          lastBattle: stats.lastBattle || null
        });
      }
    }
  };

  const loadBattleHistory = () => {
    const history = JSON.parse(localStorage.getItem('battleHistory') || '[]');
    setBattleHistory(history.slice(0, 10));
  };

  const handleBattleEntry = async (content: string) => {
    if (!user) {
      alert('Você precisa estar logado para participar!');
      router.push('/login');
      return;
    }
    
    // Verificar se o usuário já participou desta batalha
    if (currentBattle && currentBattle.participantes.includes(user.id)) {
      alert('Você já participou desta batalha!');
      return;
    }
    
    // Criar novo post
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: 'Mentira Épica',
      content,
      imageUrl: null,
      authorId: user.id,
      author: {
        id: user.id,
        name: user.displayName || user.name || 'Anônimo',
        image: user.photoURL || user.image || null
      },
      battleScore: 0,
      likes: 0,
      comments: 0
    };
    
    if (!currentBattle || currentBattle.status === 'finished') {
      // Criar nova batalha
      const newBattle: Battle = {
        id: `battle-${Date.now()}`,
        postA: newPost,
        postB: null,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias
        votesA: 0,
        votesB: 0,
        participantes: [user.id],
        status: 'waiting'
      };
      
      localStorage.setItem('activeBattle', JSON.stringify(newBattle));
      setCurrentBattle(newBattle);
    } else if (currentBattle.status === 'waiting' && !currentBattle.postB) {
      // Adicionar como segundo participante
      const updatedBattle: Battle = {
        ...currentBattle,
        postB: newPost,
        participantes: [...currentBattle.participantes, user.id],
        status: 'active'
      };
      
      localStorage.setItem('activeBattle', JSON.stringify(updatedBattle));
      setCurrentBattle(updatedBattle);
    }
    
    // Salvar post no localStorage
    const posts = JSON.parse(localStorage.getItem('battlePosts') || '[]');
    posts.push(newPost);
    localStorage.setItem('battlePosts', JSON.stringify(posts));
  };

  const handleVote = async (postId: string) => {
    if (!currentBattle || voted || !user) return;
    
    // Verificar se o usuário é um dos participantes
    if (currentBattle.participantes.includes(user.id)) {
      alert('Você não pode votar na sua própria batalha!');
      return;
    }
    
    const updatedBattle = { ...currentBattle };
    
    if (currentBattle.postA?.id === postId) {
      updatedBattle.votesA += 1;
    } else if (currentBattle.postB?.id === postId) {
      updatedBattle.votesB += 1;
    }
    
    // Salvar voto
    const votes = JSON.parse(localStorage.getItem('battleVotes') || '{}');
    votes[currentBattle.id] = {
      ...votes[currentBattle.id],
      [user.id]: postId
    };
    localStorage.setItem('battleVotes', JSON.stringify(votes));
    
    // Atualizar batalha
    localStorage.setItem('activeBattle', JSON.stringify(updatedBattle));
    setCurrentBattle(updatedBattle);
    setVoted(true);
    
    // Atualizar estatísticas do usuário
    const currentUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (currentUser.id) {
      const stats = loadUserStats(currentUser.id) || {};
      saveUserStats(currentUser.id, {
        ...stats,
        totalBattlesVoted: (stats.totalBattlesVoted || 0) + 1,
        lastBattleVote: new Date().toISOString()
      });
      
      // Determinar o vencedor e atualizar gamificação
      if (updatedBattle.votesA > updatedBattle.votesB && currentBattle.postA?.authorId === user.id) {
        onBattleWon(user.id);
      } else if (updatedBattle.votesB > updatedBattle.votesA && currentBattle.postB?.authorId === user.id) {
        onBattleWon(user.id);
      } else if (currentBattle.participantes.includes(user.id)) {
        onBattleLost(user.id);
      }
      
      // Verificar conquistas
      const unlockedAchievements = checkAchievements(user.id);
      unlockedAchievements.forEach(achievement => {
        triggerGamificationEvent('achievement', achievement);
      });
    }
  };

  const handleDeleteBattle = async (battleId: string) => {
    if (!user || !currentBattle) return;
    
    // Verificar se o usuário é um dos participantes
    if (!currentBattle.participantes.includes(user.id)) {
      alert('Você não pode excluir uma batalha da qual não participa!');
      return;
    }
    
    // Verificar se a batalha já tem dois participantes
    if (currentBattle.status === 'active' && currentBattle.postB) {
      alert('Não é possível excluir uma batalha ativa com dois participantes!');
      return;
    }
    
    // Confirmar exclusão
    if (!confirm('Tem certeza que deseja excluir sua entrada nesta batalha?')) {
      return;
    }
    
    // Remover batalha
    localStorage.removeItem('activeBattle');
    setCurrentBattle(null);
    setShowEntryModal(false);
    
    // Atualizar posts salvos
    const posts = JSON.parse(localStorage.getItem('battlePosts') || '[]');
    const updatedPosts = posts.filter((post: any) => 
      currentBattle.postA?.id !== post.id && currentBattle.postB?.id !== post.id
    );
    localStorage.setItem('battlePosts', JSON.stringify(updatedPosts));
    
    // Recarregar dados
    loadActiveBattle();
  };

  const renderBattleArena = () => {
    if (!currentBattle) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4 text-lg">
            Nenhuma batalha ativa no momento
          </p>
          <button
            onClick={() => setShowEntryModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-lg font-semibold flex items-center mx-auto"
          >
            <FaFire className="mr-3" />
            Iniciar Nova Batalha
          </button>
        </div>
      );
    }
    
    if (currentBattle.status === 'waiting') {
      return (
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Post A */}
            <div>
              {currentBattle.postA && (
                <BattleCard
                  post={currentBattle.postA}
                  onVote={() => {}}
                  voted={false}
                  winner={false}
                  disabled={true}
                  position="left"
                />
              )}
            </div>
            
            {/* Separador */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaTimes className="text-6xl text-gray-400" />
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 z-10 text-center border-2 border-dashed border-purple-400">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Aguardando Oponente
                </h3>
                <p className="text-gray-600 mb-6">
                  Seja o próximo a desafiar esta mentira!
                </p>
                
                {user && !currentBattle.participantes.includes(user.id) && (
                  <button
                    onClick={() => setShowEntryModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    <FaGlove className="inline mr-2" />
                    Batalhar Contra
                  </button>
                )}
                
                {user && currentBattle.participantes.includes(user.id) && (
                  <p className="text-sm text-gray-500">
                    Você já está participando desta batalha
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Batalha ativa
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentBattle.postA && (
            <BattleCard
              post={currentBattle.postA}
              onVote={() => handleVote(currentBattle.postA!.id)}
              voted={voted}
              winner={currentBattle.vencedorId === currentBattle.postA.id}
              disabled={voted || currentBattle.participantes.includes(user?.id || '')}
              position="left"
            />
          )}
          
          {currentBattle.postB && (
            <BattleCard
              post={currentBattle.postB}
              onVote={() => handleVote(currentBattle.postB!.id)}
              voted={voted}
              winner={currentBattle.vencedorId === currentBattle.postB.id}
              disabled={voted || currentBattle.participantes.includes(user?.id || '')}
              position="right"
            />
          )}
        </div>
        
        {/* Barra de votação */}
        {currentBattle.status === 'active' && (
          <div className="mt-6">
            <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
              <div className="flex h-full">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                  style={{
                    width: `${
                      currentBattle.votesA + currentBattle.votesB > 0
                        ? (currentBattle.votesA / (currentBattle.votesA + currentBattle.votesB)) * 100
                        : 50
                    }%`
                  }}
                />
                <div
                  className="bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-300"
                  style={{
                    width: `${
                      currentBattle.votesA + currentBattle.votesB > 0
                        ? (currentBattle.votesB / (currentBattle.votesA + currentBattle.votesB)) * 100
                        : 50
                    }%`
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{currentBattle.votesA} votos</span>
              <span>{currentBattle.votesB} votos</span>
            </div>
          </div>
        )}
        
        {/* Informações da batalha */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {voted && <p className="text-green-600 font-medium mb-2">Você já votou nesta batalha!</p>}
          {currentBattle.participantes.includes(user?.id || '') && (
            <p className="text-purple-600 font-medium mb-2">Você está participando desta batalha!</p>
          )}
          <p>
            Batalha expira em: {' '}
            {new Date(currentBattle.expiresAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Arena de Batalhas
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas do usuário */}
      <BattleStats {...userStats} />

      {/* Arena de batalha */}
      <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text flex items-center justify-center">
          <FaTrophy className="text-yellow-500 mr-3" /> 
          Arena de Batalhas
        </h2>
        
        {renderBattleArena()}
        
        {/* Ações */}
        <div className="mt-8 flex justify-center space-x-4">
          {!currentBattle && (
            <button 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center"
              onClick={() => setShowEntryModal(true)}
            >
              <FaFire className="mr-2" />
              Participar da Batalha
            </button>
          )}
          
          {currentBattle && currentBattle.status === 'waiting' && !currentBattle.participantes.includes(user?.id || '') && (
            <button 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center"
              onClick={() => setShowEntryModal(true)}
            >
              <FaGlove className="mr-2" />
              Aceitar Desafio
            </button>
          )}
          
          <button 
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center"
            onClick={() => setShowHistory(!showHistory)}
          >
            <FaHistory className="mr-2" />
            {showHistory ? 'Ocultar' : 'Ver'} Histórico
          </button>
        </div>
      </div>

      {/* Histórico de batalhas */}
      {showHistory && (
        <BattleHistory battles={battleHistory} />
      )}

      {/* Modal de entrada na batalha */}
      <BattleEntryModal
        isOpen={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        onSubmit={handleBattleEntry}
        currentUserId={user?.id || ''}
        currentBattle={currentBattle}
        onDelete={handleDeleteBattle}
      />
    </div>
  );
}