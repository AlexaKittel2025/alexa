import React, { useState, useEffect } from 'react';
import { PostType } from '../types/index';
import {
  EmojiHappyIcon as EmojiHappyIcon,
  HandThumbUpIcon as ThumbUpIcon,
  FireIcon
} from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';
import UserProfileLink from '../components/UserProfileLink';

const mockHistoricPosts: PostType[] = [
  {
    id: 'hist1',
    userId: 'user2',
    content: 'Eu treinei meu gato para programar em C++. Agora ele está trabalhando na NASA, ganhando mais que eu e construindo algoritmos espaciais. Toda semana ele me traz um presente da loja de informática.',
    imageURL: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    tags: ['pet', 'tecnologia', 'espacial'],
    reactions: {
      quaseAcreditei: 587,
      hahaha: 1254,
      mentiraEpica: 876
    },
    userReactions: {},
    judgements: {
      crivel: 345,
      inventiva: 987,
      totalmentePirada: 542
    },
    userJudgements: {},
    createdAt: new Date(2022, 2, 15).toISOString()
  },
  {
    id: 'hist2',
    userId: 'user3',
    content: 'Ontem eu consegui uma entrevista de emprego com o Bill Gates depois que hackeei a Microsoft com um Tamagotchi de 1997. Ele ficou tão impressionado que me ofereceu um cargo de vice-presidente, mas recusei porque queria mais tempo para jogar video-game.',
    tags: ['trabalho', 'tecnologia', 'famoso'],
    reactions: {
      quaseAcreditei: 478,
      hahaha: 2132,
      mentiraEpica: 1054
    },
    userReactions: {},
    judgements: {
      crivel: 213,
      inventiva: 1543,
      totalmentePirada: 621
    },
    userJudgements: {},
    createdAt: new Date(2022, 5, 7).toISOString()
  },
  {
    id: 'hist3',
    userId: 'user1',
    content: 'Acabei de voltar de uma viagem a Marte. A NASA me escolheu como primeiro turista porque ganhei um concurso de piadas sobre espaço. Trouxe uma pedra marciana que na verdade é um chocolate com corante verde.',
    imageURL: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    tags: ['espacial', 'viagem', 'comida'],
    reactions: {
      quaseAcreditei: 354,
      hahaha: 1876,
      mentiraEpica: 1432
    },
    userReactions: {},
    judgements: {
      crivel: 198,
      inventiva: 1245,
      totalmentePirada: 879
    },
    userJudgements: {},
    createdAt: new Date(2022, 7, 23).toISOString()
  },
  {
    id: 'hist4',
    userId: 'user5',
    content: 'Eu inventei um shampoo que faz o cabelo mudar de cor conforme o seu humor. Quando você está feliz, fica verde; quando está triste, fica azul. Grandes empresas estão me procurando para comprar a patente por bilhões, mas decidi vender por R$10 aos meus amigos.',
    tags: ['inventiva', 'negocio', 'beleza'],
    reactions: {
      quaseAcreditei: 432,
      hahaha: 1543,
      mentiraEpica: 876
    },
    userReactions: {},
    judgements: {
      crivel: 254,
      inventiva: 1654,
      totalmentePirada: 456
    },
    userJudgements: {},
    createdAt: new Date(2022, 9, 12).toISOString()
  },
  {
    id: 'hist5',
    userId: 'user4',
    content: 'Participei de uma competição de natação, mas esqueci de mencionar que não sei nadar. Ganhei a medalha de ouro porque todos os outros competidores ficaram tão confusos com meu estilo de "afundar e ressurgir" que pararam para assistir.',
    tags: ['esporte', 'competicao'],
    reactions: {
      quaseAcreditei: 321,
      hahaha: 2354,
      mentiraEpica: 932
    },
    userReactions: {},
    judgements: {
      crivel: 123,
      inventiva: 1243,
      totalmentePirada: 987
    },
    userJudgements: {},
    createdAt: new Date(2023, 1, 5).toISOString()
  }
];

type SortType = 'recent' | 'epic' | 'believable' | 'funny';

const HallOfFame: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [sortType, setSortType] = useState<SortType>('epic');
  const [animatingPost, setAnimatingPost] = useState<string | null>(null);
  const [animatingReaction, setAnimatingReaction] = useState<'quaseAcreditei' | 'hahaha' | 'mentiraEpica' | null>(null);

  useEffect(() => {
    // Em uma aplicação real, aqui seria feita uma chamada à API
    const sortedPosts = [...mockHistoricPosts].sort((a, b) => {
      if (sortType === 'recent') {
        return new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime();
      } else if (sortType === 'epic') {
        return (b.reactions?.mentiraEpica || 0) - (a.reactions?.mentiraEpica || 0);
      } else if (sortType === 'believable') {
        return (b.reactions?.quaseAcreditei || 0) - (a.reactions?.quaseAcreditei || 0);
      } else {
        // funny
        return (b.reactions?.hahaha || 0) - (a.reactions?.hahaha || 0);
      }
    });
    
    setPosts(sortedPosts);
  }, [sortType]);

  // Função para lidar com reações
  const handleReaction = (postId: string, reactionType: 'quaseAcreditei' | 'hahaha' | 'mentiraEpica') => {
    setAnimatingPost(postId);
    setAnimatingReaction(reactionType);
    
    // Em uma aplicação real, aqui seria feita uma requisição à API
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // Cria uma cópia do objeto de reações ou um novo objeto se não existir
        const updatedReactions = post.reactions ? {...post.reactions} : {
          quaseAcreditei: 0,
          hahaha: 0,
          mentiraEpica: 0
        };
        
        // Incrementa a reação específica
        if (updatedReactions[reactionType] !== undefined) {
          updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;
        } else {
          updatedReactions[reactionType] = 1;
        }
        
        return {
          ...post,
          reactions: updatedReactions
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    
    // Limpar a animação após um tempo
    setTimeout(() => {
      setAnimatingPost(null);
      setAnimatingReaction(null);
    }, 1000);
  };

  // Função para renderizar a animação de reação
  const renderReactionAnimation = (postId: string) => {
    if (animatingPost !== postId || !animatingReaction) return null;
    
    const emojis: Record<string, string> = {
      quaseAcreditei: '👍',
      hahaha: '😂',
      mentiraEpica: '🔥'
    };
    
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-4xl animate-float">{emojis[animatingReaction]}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hall da Fama</h1>
          <p className="text-gray-600 dark:text-gray-300">As melhores e mais incríveis mentiras de todos os tempos!</p>
        </div>
        <div className="flex items-center space-x-1">
          <StarIcon className="h-8 w-8 text-yellow-500" />
          <StarIcon className="h-10 w-10 text-yellow-500" />
          <StarIcon className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              sortType === 'epic'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSortType('epic')}
          >
            <FireIcon className="h-4 w-4 inline mr-1" />
            Mais Épicas
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              sortType === 'funny'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSortType('funny')}
          >
            <EmojiHappyIcon className="h-4 w-4 inline mr-1" />
            Mais Engraçadas
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              sortType === 'believable'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSortType('believable')}
          >
            <ThumbUpIcon className="h-4 w-4 inline mr-1" />
            Quase Críveis
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              sortType === 'recent'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSortType('recent')}
          >
            Recentes
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden relative">
            {renderReactionAnimation(post.id)}
            <div className="relative">
              {index === 0 && sortType !== 'recent' && (
                <div className="absolute top-0 left-0 bg-yellow-500 text-white py-1 px-3 rounded-br-lg font-bold flex items-center">
                  <StarIcon className="h-4 w-4 mr-1" />
                  TOP 1
                </div>
              )}
              
              {post.imageURL && (
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={post.imageURL} 
                    alt="Imagem da mentira" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <UserProfileLink userId={post.userId || ''} className="mr-3">
                  <img 
                    src={post.user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
                  />
                </UserProfileLink>
                <div>
                  <UserProfileLink userId={post.userId || ''} className="hover:underline">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Usuário Mentiroso</h3>
                  </UserProfileLink>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt || new Date()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 text-lg mb-4">{post.content}</p>
              
              <div className="flex mb-4">
                {post.tags?.map((tag, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs mr-2 px-2.5 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-6">
                <button 
                  onClick={() => handleReaction(post.id, 'quaseAcreditei')}
                  className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-800/30 transition cursor-pointer"
                >
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">{post.reactions?.quaseAcreditei || 0}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center">
                    <ThumbUpIcon className="h-4 w-4 mr-1" />
                    Quase Acreditei
                  </p>
                </button>
                <button
                  onClick={() => handleReaction(post.id, 'hahaha')}
                  className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition cursor-pointer"
                >
                  <p className="text-yellow-600 dark:text-yellow-400 font-semibold text-lg">{post.reactions?.hahaha || 0}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center">
                    <EmojiHappyIcon className="h-4 w-4 mr-1" />
                    Hahaha
                  </p>
                </button>
                <button
                  onClick={() => handleReaction(post.id, 'mentiraEpica')}
                  className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center hover:bg-red-100 dark:hover:bg-red-800/30 transition cursor-pointer"
                >
                  <p className="text-red-600 dark:text-red-400 font-semibold text-lg">{post.reactions?.mentiraEpica || 0}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center">
                    <FireIcon className="h-4 w-4 mr-1" />
                    Mentira Épica
                  </p>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfFame; 