import { ClockIcon, FireIcon, HashtagIcon, TrendingUpIcon } from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post as PostType } from '../types';
import Post from '../components/Post';
import { mockPosts } from '../services/mockData';

const Trending: React.FC = () => {
  const navigate = useNavigate();
  const [trendingPosts, setTrendingPosts] = useState<PostType[]>([]);
  const [trendingTags, setTrendingTags] = useState<{tag: string, count: number}[]>([]);
  const [timeFilter, setTimeFilter] = useState<'hoje' | 'semana' | 'mes'>('hoje');
  const [isLoading, setIsLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true);
    
    setTimeout(() => {
      // Em uma aplicação real, você buscaria esses dados de uma API
      // Simular posts em tendência com base no número total de reações + julgamentos
      const sortedPosts = [...mockPosts].sort((a, b) => {
        const reactionsA = (a.reactions?.quaseAcreditei || 0) + (a.reactions?.hahaha || 0) + (a.reactions?.mentiraEpica || 0);
        const judgmentsA = (a.judgements?.crivel || 0) + (a.judgements?.inventiva || 0) + (a.judgements?.totalmentePirada || 0);
        
        const reactionsB = (b.reactions?.quaseAcreditei || 0) + (b.reactions?.hahaha || 0) + (b.reactions?.mentiraEpica || 0);
        const judgmentsB = (b.judgements?.crivel || 0) + (b.judgements?.inventiva || 0) + (b.judgements?.totalmentePirada || 0);
        
        return (reactionsB + judgmentsB) - (reactionsA + judgmentsA);
      });
      
      // Filtrar com base no tempo selecionado
      const now = new Date();
      const filtered = sortedPosts.filter(post => {
        const postDate = new Date(post.createdAt);
        
        if (timeFilter === 'hoje') {
          // Apenas posts de hoje
          return now.getDate() === postDate.getDate() && 
                 now.getMonth() === postDate.getMonth() &&
                 now.getFullYear() === postDate.getFullYear();
        } else if (timeFilter === 'semana') {
          // Posts da última semana
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          return postDate >= sevenDaysAgo;
        } else {
          // Posts do último mês
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return postDate >= thirtyDaysAgo;
        }
      });
      
      setTrendingPosts(filtered);
      
      // Calcular tags em tendência
      const tagCount: Record<string, number> = {};
      
      mockPosts.forEach(post => {
        post.tags?.forEach(tag => {
          if (tag) {
            if (tagCount[tag]) {
              tagCount[tag]++;
            } else {
              tagCount[tag] = 1;
            }
          }
        });
      });
      
      const tagArray = Object.entries(tagCount).map(([tag, count]) => ({ tag, count }));
      const sortedTags = tagArray.sort((a, b) => b.count - a.count).slice(0, 10);
      
      setTrendingTags(sortedTags);
      setIsLoading(false);
    }, 1000);
  }, [timeFilter]);

  const handleReaction = (postId: string, reactionType: 'quaseAcreditei' | 'hahaha' | 'mentiraEpica') => {
    setTrendingPosts(posts => 
      posts.map(post => {
        if (post.id === postId) {
          const reactions = { 
            quaseAcreditei: 0, 
            hahaha: 0, 
            mentiraEpica: 0,
            ...(post.reactions || {}) 
          };
          reactions[reactionType] = reactions[reactionType] + 1;
          
          return {
            ...post,
            reactions
          };
        }
        return post;
      })
    );
  };

  const handleJudgement = (postId: string, judgementType: 'crivel' | 'inventiva' | 'totalmentePirada') => {
    setTrendingPosts(posts => 
      posts.map(post => {
        if (post.id === postId) {
          const judgements = { 
            crivel: 0, 
            inventiva: 0, 
            totalmentePirada: 0,
            ...(post.judgements || {}) 
          };
          judgements[judgementType] = judgements[judgementType] + 1;
          
          return {
            ...post,
            judgements
          };
        }
        return post;
      })
    );
  };

  const handleToggleSavePost = (postId: string) => {
    setSavedPosts(prevSavedPosts => {
      if (prevSavedPosts.includes(postId)) {
        return prevSavedPosts.filter(id => id !== postId);
      } else {
        return [...prevSavedPosts, postId];
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white flex items-center">
          <FireIcon className="w-8 h-8 text-orange-500 mr-2" />
          Tendências
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Confira as mentiras e tópicos mais populares do momento no Mentei!
        </p>
      </div>
      
      {/* Filtros de tempo */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center">
          <ClockIcon className="w-5 h-5 mr-2" />
          Filtrar por período
        </h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              timeFilter === 'hoje' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setTimeFilter('hoje')}
          >
            Hoje
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              timeFilter === 'semana' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setTimeFilter('semana')}
          >
            Esta semana
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              timeFilter === 'mes' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setTimeFilter('mes')}
          >
            Este mês
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Posts em Tendência */}
        <div className="lg:w-3/4">
          <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
            <TrendingUpIcon className="w-6 h-6 mr-2" />
            Mentiras em Alta
          </h2>
          
          {isLoading ? (
            // Esqueletos de carregamento
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : trendingPosts.length > 0 ? (
            <div>
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 text-blue-700 dark:text-blue-200 text-sm">
                Mostrando {trendingPosts.length} mentiras em tendência no período selecionado
              </div>
              <div className="space-y-4">
                {trendingPosts.map(post => (
                  <Post
                    key={post.id}
                    post={post}
                    onJudgement={handleJudgement}
                    onReport={(postId, reason) => console.log('Reported:', postId, reason)}
                    isSaved={savedPosts.includes(post.id)}
                    onToggleSave={handleToggleSavePost}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Não há mentiras em tendência para o período selecionado.
              </p>
            </div>
          )}
        </div>
        
        {/* Tags em Tendência */}
        <div className="lg:w-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
            <HashtagIcon className="w-6 h-6 mr-2" />
            Tags em Alta
          </h2>
          
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              ))}
            </div>
          ) : trendingTags.length > 0 ? (
            <div className="space-y-2">
              {trendingTags.map((tag, index) => (
                <div 
                  key={tag.tag} 
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400 mr-2">
                      {index + 1}
                    </span>
                    <span className="text-primary font-medium">
                      #{tag.tag}
                    </span>
                  </div>
                  <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                    {tag.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Não há tags em tendência para mostrar.
            </p>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-3 dark:text-white">Explorar por tema</h3>
            <div className="flex flex-wrap gap-2">
              {['alien', 'vidarica', 'pet', 'comida', 'tecnologia', 'viagem', 'famoso', 'trabalho', 'estranho', 'criança'].map(tag => (
                <span 
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending; 