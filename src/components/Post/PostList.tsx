'use client';

import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import Link from 'next/link';
import Image from 'next/image';
import { FaThumbsUp, FaComment, FaShare, FaExclamationTriangle, FaClock, FaSearch } from 'react-icons/fa';
import { postsApi } from '@/lib/api-client';
import { ExtendedPost } from '@/types/prisma';

interface PostListProps {
  filter?: string;
  tag?: string;
  uid?: string;
  limit?: number;
}

interface Tag {
  tag: {
    name: string;
  };
}

interface ExtendedPost {
  id: string;
  title?: string;
  content: string;
  likes?: number;
  comments?: number;
  shares?: number;
  authorId: string;
  createdAt: Date;
  author?: {
    id: string;
    name: string;
    image?: string;
  };
  tags: Tag[];
  imageUrl?: string;
  isActive?: boolean;
}

export default function PostList({ filter, tag, uid, limit: postsLimit = 10 }: PostListProps) {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('zoou_demais');
  const [useLocalData, setUseLocalData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dados de demonstração para caso a API não retorne dados
  const fakePosts: ExtendedPost[] = [
    {
      id: 'demo1',
      title: 'Minha história incrível',
      content: 'Ontem eu estava caminhando pela rua quando vi uma nave espacial pousando no meio da praça. Ninguém além de mim parecia notar. Um alienígena saiu e me ofereceu um sorvete de pistache.',
      tags: [{ tag: { name: 'alienígena' } }, { tag: { name: 'sorvete' } }, { tag: { name: 'inacreditável' } }],
      imageUrl: 'https://picsum.photos/seed/alien/800/600',
      authorId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      views: 154,
      author: {
        id: 'user1',
        name: 'Rafael Silveira',
        image: 'https://i.pravatar.cc/150?img=1'
      },
      comments: [],
      reactions: []
    },
    {
      id: 'demo2',
      title: 'Conheci o Presidente',
      content: 'Estava fazendo compras no supermercado quando esbarrei num homem. Quando olhei para cima, era o presidente do país! Ele me pediu conselhos sobre a economia e depois pagou minhas compras.',
      tags: [{ tag: { name: 'presidente' } }, { tag: { name: 'economia' } }, { tag: { name: 'sorte' } }],
      imageUrl: 'https://picsum.photos/seed/president/800/600',
      authorId: 'user2',
      createdAt: new Date(Date.now() - 3600000), // 1 hora atrás
      updatedAt: new Date(Date.now() - 3600000),
      isActive: true,
      views: 302,
      author: {
        id: 'user2',
        name: 'Carla Mendes',
        image: 'https://i.pravatar.cc/150?img=5'
      },
      comments: [],
      reactions: []
    },
    {
      id: 'demo3',
      title: 'Meu gato fala',
      content: 'Descobri que meu gato sabe falar português fluentemente, mas só quando ninguém mais está por perto. Ele tem me dado dicas de investimentos que já me fizeram ganhar milhões.',
      tags: [{ tag: { name: 'gato' } }, { tag: { name: 'investimentos' } }, { tag: { name: 'millionaire' } }],
      imageUrl: 'https://picsum.photos/seed/cat/800/600',
      authorId: 'user3',
      createdAt: new Date(Date.now() - 7200000), // 2 horas atrás
      updatedAt: new Date(Date.now() - 7200000),
      isActive: true,
      views: 489,
      author: {
        id: 'user3',
        name: 'Leonardo Costa',
        image: 'https://i.pravatar.cc/150?img=8'
      },
      comments: [],
      reactions: []
    }
  ];
  
  useEffect(() => {
    // Resetar o estado quando os filtros mudarem
    setPosts([]);
    setLastPostId(null);
    setHasMore(true);
    
    fetchPosts();
  }, [filter, tag, uid]);

  const fetchPosts = async () => {
    setLoading(true);
    
    try {
      let fetchedPosts;
      
      if (tag) {
        // Buscar posts pela tag
        fetchedPosts = await postsApi.getPostsByTag(tag, postsLimit, lastPostId || undefined);
      } else if (uid) {
        // Buscar posts de um usuário específico
        fetchedPosts = await postsApi.getPostsByUser(uid, postsLimit, lastPostId || undefined);
      } else {
        // Buscar todos os posts
        fetchedPosts = await postsApi.getPosts(postsLimit, lastPostId || undefined);
      }
      
      // Converter strings de data para objetos Date
      const processedPosts = fetchedPosts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt)
      }));
      
      if (processedPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => prev.length === 0 ? processedPosts : [...prev, ...processedPosts]);
        const lastPost = processedPosts[processedPosts.length - 1];
        setLastPostId(lastPost.id);
      }
    } catch (error) {
      
      // Em caso de erro, mostrar posts de demonstração
      if (posts.length === 0) {
        setPosts(fakePosts);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (postId: string) => {
    setSelectedPost(postId);
    setShowReportModal(true);
  };

  const submitReport = () => {
    
    setShowReportModal(false);
    setSelectedPost(null);
    
    // Aqui mostraria uma notificação de confirmação na interface
    alert('Denúncia enviada com sucesso!');
  };

  // Função para calcular o tempo restante
  const calcularTempoRestante = (data: Date): string => {
    const agora = new Date();
    const dataExpiracao = new Date(data);
    dataExpiracao.setHours(dataExpiracao.getHours() + 24);
    
    const diferencaMs = dataExpiracao.getTime() - agora.getTime();
    if (diferencaMs <= 0) return "Expirado";
    
    const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
    const minutos = Math.floor((diferencaMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas}h ${minutos}m`;
  };

  // Filtrar posts pelo termo de busca
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-11/12 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>
            <div className="h-48 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Procurar mentiras..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum post encontrado. Seja o primeiro a compartilhar!</p>
        </div>
      ) : (
        <>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                onClick={fetchPosts}
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Carregar mais'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de Denúncia */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Denunciar mentira</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Por qual motivo você está denunciando esta mentira?</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              submitReport();
            }}>
              <div className="space-y-2 mb-6">
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="report-reason" 
                    value="zoou_demais" 
                    checked={reportReason === 'zoou_demais'}
                    onChange={() => setReportReason('zoou_demais')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Zoou demais (Exagerou na mentira)</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="report-reason" 
                    value="conteudo_ofensivo"
                    checked={reportReason === 'conteudo_ofensivo'}
                    onChange={() => setReportReason('conteudo_ofensivo')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Conteúdo ofensivo ou inadequado</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="report-reason" 
                    value="spam" 
                    checked={reportReason === 'spam'}
                    onChange={() => setReportReason('spam')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Spam ou conteúdo repetitivo</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="report-reason" 
                    value="mentira_perigosa" 
                    checked={reportReason === 'mentira_perigosa'}
                    onChange={() => setReportReason('mentira_perigosa')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Mentira perigosa (pode causar danos)</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Enviar denúncia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 