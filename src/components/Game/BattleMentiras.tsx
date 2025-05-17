'use client';

import { useState, useEffect } from 'react';
import { FaCrown, FaThumbsUp, FaTrophy } from 'react-icons/fa';
import Link from 'next/link';
import { ExtendedPost } from '@/types/prisma';

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
}

export default function BattleMentiras() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentBattle, setCurrentBattle] = useState<[Post, Post] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [battlesCompleted, setBattlesCompleted] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=20');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
        } else {
          console.error('Erro ao buscar posts:', await response.text());
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setIsLoading(false);
        setupNewBattle();
      }
    };

    fetchPosts();
  }, []);

  const setupNewBattle = () => {
    if (posts.length < 2) {
      setCurrentBattle(null);
      return;
    }

    setVoted(false);
    setWinner(null);

    // Selecionar 2 posts aleatórios para a batalha
    const availablePosts = [...posts];
    
    // Primeiro post aleatório
    const randomIndex1 = Math.floor(Math.random() * availablePosts.length);
    const post1 = availablePosts[randomIndex1];
    availablePosts.splice(randomIndex1, 1);
    
    // Segundo post aleatório (diferente do primeiro)
    const randomIndex2 = Math.floor(Math.random() * availablePosts.length);
    const post2 = availablePosts[randomIndex2];
    
    setCurrentBattle([post1, post2]);
  };

  const handleVote = async (winnerIndex: number) => {
    if (!currentBattle || voted) return;
    
    const winnerPost = currentBattle[winnerIndex];
    const loserPost = currentBattle[winnerIndex === 0 ? 1 : 0];
    
    setVoted(true);
    setWinner(winnerPost.id);
    setBattlesCompleted(prev => prev + 1);
    
    try {
      // Atualizar pontuação de batalha via API
      const response = await fetch(`/api/posts/${winnerPost.id}/battle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Atualizar localmente para refletir na UI
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === winnerPost.id 
              ? { ...post, battleScore: (post.battleScore || 0) + 1 } 
              : post
          )
        );
      }
      
      // Verificar se o usuário completou 10 batalhas para conquista
      if (battlesCompleted + 1 === 10) {
        // Armazenar conquista no localStorage (em um app real, iria para o banco de dados)
        const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
        userAchievements.batalhasMentiras = true;
        localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
      }
      
      // Aguardar um tempo para mostrar resultado antes da próxima batalha
      setTimeout(() => {
        setupNewBattle();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao registrar voto:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800 text-center">Batalha de Mentiras</h2>
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!currentBattle) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800 text-center">Batalha de Mentiras</h2>
        <p className="text-center py-6 text-gray-600">
          Não há posts suficientes para iniciar uma batalha.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-purple-800 text-center flex items-center justify-center">
        <FaTrophy className="text-yellow-500 mr-2" /> Batalha de Mentiras
      </h2>
      
      <p className="text-center mb-6 text-sm text-gray-600">
        Qual mentira é melhor? Vote na sua favorita!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentBattle.map((post, index) => (
          <div 
            key={post.id} 
            className={`p-4 border rounded-lg cursor-pointer transition-all
              ${winner === post.id ? 'border-green-500 bg-green-50' : 
                winner && winner !== post.id ? 'opacity-50' : 
                'border-gray-200 hover:border-purple-300 hover:shadow-md'}
            `}
            onClick={() => !voted && handleVote(index)}
          >
            <div className="flex items-center mb-2">
              <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                {post.author?.image ? (
                  <img src={post.author.image} alt={post.author.name || ''} className="h-8 w-8 rounded-full" />
                ) : (
                  <span className="text-purple-800 font-bold">{post.author?.name?.charAt(0) || '?'}</span>
                )}
              </div>
              <div>
                <p className="font-medium">{post.author?.name || 'Anônimo'}</p>
                {post.battleScore !== undefined && post.battleScore > 0 && (
                  <p className="text-xs text-yellow-600 flex items-center">
                    <FaCrown className="mr-1" size={10} /> {post.battleScore} vitórias
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-gray-800 mb-2">{post.content.length > 120 ? `${post.content.substring(0, 120)}...` : post.content}</p>
            
            {winner === post.id && (
              <div className="mt-2 bg-green-100 p-2 rounded-lg text-center text-green-800 font-medium">
                Vencedor!
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Batalhas completadas: {battlesCompleted}/10
          {battlesCompleted >= 10 && (
            <span className="ml-2 text-yellow-600 flex items-center justify-center mt-1">
              <FaCrown className="mr-1" /> Conquista desbloqueada!
            </span>
          )}
        </p>
      </div>
      
      {voted && (
        <div className="mt-4 flex justify-center">
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={setupNewBattle}
          >
            Próxima batalha
          </button>
        </div>
      )}
    </div>
  );
} 