'use client';

import { useState, useEffect, lazy, Suspense, memo, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { generateRealPersonAvatar, generatePostImage } from '@/utils/avatarUtils';
import { getUserData } from '@/lib/gamification';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lazy load componentes pesados
const InstagramPost = dynamic(() => import('@/components/Post/InstagramPost'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mb-4" />,
  ssr: false
});

const Stories = dynamic(() => import('@/components/Stories'), {
  loading: () => <div className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mb-6" />,
  ssr: false
});

const UserCard = dynamic(() => import('@/components/UserCard'), {
  loading: () => <div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mb-2" />,
  ssr: false
});

const SuggestionCard = dynamic(() => import('@/components/SuggestionCard'), {
  loading: () => <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />,
  ssr: false
});

// Memoized components
const PostsList = memo(({ posts }: { posts: any[] }) => {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <InstagramPost
          key={post.id}
          post={post}
          index={index}
        />
      ))}
    </div>
  );
});

PostsList.displayName = 'PostsList';

const SuggestionsList = memo(({ users }: { users: any[] }) => {
  return (
    <div className="space-y-3">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          showFollowButton={true}
        />
      ))}
    </div>
  );
});

SuggestionsList.displayName = 'SuggestionsList';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);

  // Memoized mock data generation
  const generateMockPosts = useCallback(() => {
    return [
      {
        id: '1',
        user: {
          id: '1',
          name: 'João Silva',
          username: 'joaosilva',
          avatar: generateRealPersonAvatar('men')
        },
        content: 'Acabei de chegar em casa e meu cachorro já tinha arrumado toda a casa. Até a cama estava feita! 🐕✨',
        image: generatePostImage(),
        likes: 0,
        comments: 0,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likedByMe: false,
        saved: false
      },
      // ... outros posts
    ];
  }, []);

  const generateSuggestedUsers = useCallback(() => {
    return [
      {
        id: '6',
        name: 'Juliana Pereira',
        username: 'jupereira',
        avatar: generateRealPersonAvatar('women'),
        bio: 'Exploradora de mentiras criativas',
        isFollowing: false
      },
      // ... outros usuários
    ];
  }, []);

  // Carregar dados com delay para simular API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Carregar dados
      setPosts(generateMockPosts());
      setSuggestedUsers(generateSuggestedUsers());
      
      // Carregar dados do usuário atual
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        const userData = getUserData('user-1');
        setCurrentUser(userData);
      }
      
      setLoading(false);
    };

    loadData();
  }, [generateMockPosts, generateSuggestedUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed Principal */}
        <div className="lg:col-span-2">
          {/* Stories */}
          <Suspense fallback={<div className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mb-6" />}>
            <Stories />
          </Suspense>
          
          {/* Posts */}
          <Suspense fallback={
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
              ))}
            </div>
          }>
            <PostsList posts={posts} />
          </Suspense>
        </div>

        {/* Barra Lateral */}
        <div className="hidden lg:block">
          {/* Perfil do usuário atual */}
          {currentUser && (
            <div className="mb-6">
              <UserCard
                user={currentUser}
                showFollowButton={false}
              />
            </div>
          )}

          {/* Sugestões */}
          <Suspense fallback={<div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
            <SuggestionCard />
          </Suspense>
          
          {/* Usuários sugeridos */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Sugestões para você
              </h3>
              <a href="#" className="text-xs font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
                Ver todos
              </a>
            </div>
            
            <Suspense fallback={
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                ))}
              </div>
            }>
              <SuggestionsList users={suggestedUsers} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}