'use client';

import { useState, useEffect } from 'react';
import InstagramPost from '@/components/Post/InstagramPost';
import CreatePost from '@/components/CreatePost';
import Stories from '@/components/Stories';
import { FaGlobe, FaUserFriends, FaFire, FaClock, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { awardXP } from '@/lib/gamification';

interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: Date;
  reactions?: {
    like: number;
    hahaha: number;
    quaseAcreditei: number;
    mentiraEpica: number;
  };
}

interface FeedTab {
  id: 'global' | 'following' | 'trending' | 'recent';
  label: string;
  icon: React.FC<any>;
}

const feedTabs: FeedTab[] = [
  { id: 'global', label: 'Global', icon: FaGlobe },
  { id: 'following', label: 'Seguindo', icon: FaUserFriends },
  { id: 'trending', label: 'Em Alta', icon: FaFire },
  { id: 'recent', label: 'Recentes', icon: FaClock }
];

export default function PersonalizedFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<FeedTab['id']>('global');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 'current',
    name: 'Você',
    username: 'seuusername',
    avatar: '/images/avatar-placeholder.jpg'
  });

  // Carregar posts do localStorage ou API
  useEffect(() => {
    loadFeedPosts();
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setCurrentUser(prev => ({
        ...prev,
        name: profile.name || prev.name,
        username: profile.username || prev.username,
        avatar: profile.avatar || prev.avatar,
      }));
    }
  }, [activeTab]);

  const loadFeedPosts = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento baseado na aba ativa
      // Em produção, isso seria uma chamada API real
      let loadedPosts: Post[] = [];
      
      switch (activeTab) {
        case 'global':
          // Carregar posts globais
          loadedPosts = await loadGlobalPosts();
          break;
        case 'following':
          // Carregar posts de usuários seguidos
          loadedPosts = await loadFollowingPosts();
          break;
        case 'trending':
          // Carregar posts em alta
          loadedPosts = await loadTrendingPosts();
          break;
        case 'recent':
          // Carregar posts mais recentes
          loadedPosts = await loadRecentPosts();
          break;
      }
      
      setPosts(loadedPosts);
    } catch (error) {
      toast.error('Erro ao carregar posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Funções simuladas para carregar posts de diferentes categorias
  const loadGlobalPosts = async (): Promise<Post[]> => {
    // Em produção seria: const response = await fetch('/api/posts/global');
    const saved = localStorage.getItem('global-posts');
    if (saved) {
      return JSON.parse(saved).map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }));
    }
    return [];
  };

  const loadFollowingPosts = async (): Promise<Post[]> => {
    // Em produção seria: const response = await fetch('/api/posts/following');
    const saved = localStorage.getItem('following-posts');
    if (saved) {
      return JSON.parse(saved).map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }));
    }
    return [];
  };

  const loadTrendingPosts = async (): Promise<Post[]> => {
    // Em produção seria: const response = await fetch('/api/posts/trending');
    const saved = localStorage.getItem('trending-posts');
    if (saved) {
      return JSON.parse(saved).map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }));
    }
    return [];
  };

  const loadRecentPosts = async (): Promise<Post[]> => {
    // Em produção seria: const response = await fetch('/api/posts/recent');
    const saved = localStorage.getItem('recent-posts');
    if (saved) {
      return JSON.parse(saved).map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }));
    }
    return [];
  };

  const handlePostCreated = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      content,
      image,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      reactions: {
        like: 0,
        hahaha: 0,
        quaseAcreditei: 0,
        mentiraEpica: 0
      }
    };

    // Adicionar novo post ao feed
    setPosts([newPost, ...posts]);

    // Salvar no localStorage
    const currentPosts = [...posts, newPost];
    localStorage.setItem(`${activeTab}-posts`, JSON.stringify(currentPosts));

    // Gamificação
    const gamification = awardXP(currentUser.id, 'post_created');
    if (gamification.notifications.length > 0) {
      window.dispatchEvent(new CustomEvent('gamification', { 
        detail: gamification.notifications[0] 
      }));
    }
    
    toast.success('Mentira publicada com sucesso!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories */}
      <div className="mb-8">
        <Stories />
      </div>

      {/* Create Post */}
      <div className="mb-6">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      {/* Feed Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {feedTabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-gray-400 text-2xl" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma mentira por aqui ainda...
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Seja o primeiro a compartilhar uma história incrível!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <InstagramPost
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={() => {}}
              onComment={() => {}}
              onSave={() => {}}
              onShare={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}