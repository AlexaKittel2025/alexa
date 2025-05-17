import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post as PostType, Battle as BattleType } from '../types';
import { mockPosts, mockBattles as mockBattlesData } from '../services/mockData';
import UserProfileLink from '../components/UserProfileLink';

const Battles: React.FC = () => {
  const [battles, setBattles] = useState<BattleType[]>([]);
  const [activeBattleIndex, setActiveBattleIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Usar os dados mockados importados de mockData.ts
    setBattles(mockBattlesData);
  }, []);

  const getPostById = (postId: string): PostType | undefined => {
    return mockPosts.find(p => p.id === postId);
  };

  const handleNext = () => {
    setActiveBattleIndex(prev => (prev + 1) % battles.length);
  };
  
  const handlePrevious = () => {
    setActiveBattleIndex(prev => (prev - 1 + battles.length) % battles.length);
  };
  
  const handleVote = (battleId: string, postId: string) => {
    const currentUserId = 'user123';
    
    setBattles(battles.map(battle => {
      if (battle.id === battleId) {
        const otherPostId = battle.postIds?.find(id => id !== postId);
        if (!otherPostId || !battle.postIds || !battle.votes) return battle;
        
        // Se já votou no mesmo post, remove o voto
        if (battle.votes[postId]?.includes(currentUserId)) {
          return {
            ...battle,
            votes: {
              ...battle.votes,
              [postId]: battle.votes[postId].filter(id => id !== currentUserId)
            }
          };
        }
        
        // Se já votou no outro post, muda o voto
        if (battle.votes[otherPostId]?.includes(currentUserId)) {
          return {
            ...battle,
            votes: {
              ...battle.votes,
              [otherPostId]: battle.votes[otherPostId].filter(id => id !== currentUserId),
              [postId]: [...(battle.votes[postId] || []), currentUserId]
            }
          };
        }
        
        // Se ainda não votou, adiciona o voto
        return {
          ...battle,
          votes: {
            ...battle.votes,
            [postId]: [...(battle.votes[postId] || []), currentUserId]
          }
        };
      }
      return battle;
    }));
  };
  
  const isUserVoted = (battle: BattleType, postId: string) => {
    const currentUserId = 'user123';
    return battle.votes && 
           battle.votes[postId] && 
           Array.isArray(battle.votes[postId]) && 
           battle.votes[postId].includes(currentUserId);
  };

  const navigateToUserProfile = (userId: string, username?: string) => {
    navigate(`/profile/${username || userId}`);
  };

  if (battles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Batalha de Mentiras</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Carregando batalhas...</p>
        </div>
      </div>
    );
  }

  const activeBattle = battles[activeBattleIndex];
  if (!activeBattle || !activeBattle.postIds) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Batalha de Mentiras</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Batalha não encontrada</p>
        </div>
      </div>
    );
  }

  const post1 = getPostById(activeBattle.postIds[0]);
  const post2 = getPostById(activeBattle.postIds[1]);

  if (!post1 || !post2) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Batalha de Mentiras</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Erro ao carregar posts da batalha</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Batalha de Mentiras</h1>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-8">Vote na mentira mais absurda!</p>
      
      <div className="mb-8 flex justify-between items-center">
        <button 
          onClick={handlePrevious}
          className="btn-secondary"
        >
          Batalha Anterior
        </button>
        <span className="text-xl font-semibold">
          Batalha {activeBattleIndex + 1} de {battles.length}
        </span>
        <button 
          onClick={handleNext}
          className="btn-primary"
        >
          Próxima Batalha
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex-1 card ${isUserVoted(activeBattle, post1.id) ? 'ring-4 ring-primary' : ''}`}>
          <div className="flex items-center mb-3">
            <UserProfileLink userId={post1.userId} className="flex items-center gap-2 cursor-pointer">
              <img 
                src={post1.user?.photoURL || "..."} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full mr-3 hover:opacity-80 transition"
              />
              <div>
                <h3 className="font-semibold text-dark dark:text-white hover:underline">
                  {post1.user?.displayName || "Usuário Mentiroso"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post1.createdAt).toLocaleDateString()}
                </p>
              </div>
            </UserProfileLink>
          </div>

          {post1.imageURL && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img 
                src={post1.imageURL} 
                alt="Post image" 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            {post1.content}
          </p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-primary">{post1.reactions?.quaseAcreditei || 0}</span> quase acreditei
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-secondary">{post1.reactions?.hahaha || 0}</span> hahaha
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-accent">{post1.reactions?.mentiraEpica || 0}</span> épica
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={() => handleVote(activeBattle.id, post1.id)}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isUserVoted(activeBattle, post1.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
            >
              {isUserVoted(activeBattle, post1.id) ? 'Votado ✓' : 'Votar Nesta Mentira'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center text-xl font-bold dark:text-white">
          VS
        </div>
        
        <div className={`flex-1 card ${isUserVoted(activeBattle, post2.id) ? 'ring-4 ring-primary' : ''}`}>
          <div className="flex items-center mb-3">
            <UserProfileLink userId={post2.userId} className="flex items-center gap-2 cursor-pointer">
              <img 
                src={post2.user?.photoURL || "..."} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full mr-3 hover:opacity-80 transition"
              />
              <div>
                <h3 className="font-semibold text-dark dark:text-white hover:underline">
                  {post2.user?.displayName || "Usuário Mentiroso"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post2.createdAt).toLocaleDateString()}
                </p>
              </div>
            </UserProfileLink>
          </div>
          
          {post2.imageURL && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img 
                src={post2.imageURL} 
                alt="Post image" 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            {post2.content}
          </p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-primary">{post2.reactions?.quaseAcreditei || 0}</span> quase acreditei
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-secondary">{post2.reactions?.hahaha || 0}</span> hahaha
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-accent">{post2.reactions?.mentiraEpica || 0}</span> épica
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={() => handleVote(activeBattle.id, post2.id)}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isUserVoted(activeBattle, post2.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
            >
              {isUserVoted(activeBattle, post2.id) ? 'Votado ✓' : 'Votar Nesta Mentira'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Campeões da Semana</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Avatar" 
                className="w-20 h-20 rounded-full cursor-pointer hover:opacity-80 transition"
                onClick={() => navigateToUserProfile('user1')}
              />
            </div>
            <h3 
              className="font-bold text-xl dark:text-white hover:underline cursor-pointer"
              onClick={() => navigateToUserProfile('user1')}
            >
              Usuário Ouro
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">347 votos</p>
            <p className="text-gray-800 dark:text-gray-200 italic">"Meu cachorro aprendeu a programar em Python..."</p>
          </div>
          
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Avatar" 
                className="w-20 h-20 rounded-full cursor-pointer hover:opacity-80 transition"
                onClick={() => navigateToUserProfile('user2')}
              />
            </div>
            <h3 
              className="font-bold text-xl dark:text-white hover:underline cursor-pointer"
              onClick={() => navigateToUserProfile('user2')}
            >
              Usuário Prata
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">298 votos</p>
            <p className="text-gray-800 dark:text-gray-200 italic">"Fui promovido a CEO da empresa ontem..."</p>
          </div>
          
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Avatar" 
                className="w-20 h-20 rounded-full cursor-pointer hover:opacity-80 transition"
                onClick={() => navigateToUserProfile('user3')}
              />
            </div>
            <h3 
              className="font-bold text-xl dark:text-white hover:underline cursor-pointer"
              onClick={() => navigateToUserProfile('user3')}
            >
              Usuário Bronze
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">243 votos</p>
            <p className="text-gray-800 dark:text-gray-200 italic">"Acabo de encontrar Neymar no shopping..."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battles; 