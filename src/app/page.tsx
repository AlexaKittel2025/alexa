'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { generateRealPersonAvatar, generatePostImage } from '@/utils/avatarUtils';
import InstagramPost from '@/components/Post/InstagramPost';
import Stories from '@/components/Stories';
import UserCard from '@/components/UserCard';
import SuggestionsSection from '@/components/SuggestionsSection';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CreatePostInline from '@/components/CreatePostInline';

// Mock data com imagens reais
const mockPosts = [
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
  {
    id: '2',
    user: {
      id: '2',
      name: 'Maria Santos',
      username: 'mariasantos',
      avatar: generateRealPersonAvatar('women')
    },
    content: 'Hoje na academia levantei 200kg no supino. O personal ficou tão impressionado que me ofereceu um contrato para ser instrutor! 💪',
    image: generatePostImage(),
    likes: 0,
    comments: 0,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likedByMe: false,
    saved: false
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Pedro Costa',
      username: 'pedrocosta',
      avatar: generateRealPersonAvatar('men')
    },
    content: 'Encontrei uma lâmpada mágica na praia. O gênio me deu 3 desejos mas usei todos pedindo mais desejos. Agora tenho desejos infinitos! 🧞‍♂️',
    image: generatePostImage(),
    likes: 0,
    comments: 0,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likedByMe: false,
    saved: false
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Ana Oliveira',
      username: 'anaoliveira',
      avatar: generateRealPersonAvatar('women')
    },
    content: 'Meu café da manhã de hoje: caviar, lagosta e champagne. É assim que começo todos os meus dias! ☕✨ #VidaDeLuxo',
    image: generatePostImage(),
    likes: 0,
    comments: 0,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likedByMe: false,
    saved: false
  },
  {
    id: '5',
    user: {
      id: '5',
      name: 'Carlos Rodrigues',
      username: 'carlosrodrigues',
      avatar: generateRealPersonAvatar('men')
    },
    content: 'Acabei de voltar de Marte. A viagem foi tranquila, apenas 3 horas de voo. O Elon Musk me convidou pessoalmente! 🚀👽',
    image: generatePostImage(),
    likes: 0,
    comments: 0,
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    likedByMe: false,
    saved: false
  }
];

// Mock de usuários sugeridos
const suggestedUsers = [
  {
    id: '6',
    name: 'Juliana Pereira',
    username: 'jupereira',
    avatar: generateRealPersonAvatar('women'),
    bio: 'Exploradora de mentiras criativas',
    isFollowing: false
  },
  {
    id: '7',
    name: 'Rafael Mendes',
    username: 'rafamendes',
    avatar: generateRealPersonAvatar('men'),
    bio: 'Mestre em inventar histórias',
    isFollowing: false
  },
  {
    id: '8',
    name: 'Beatriz Lima',
    username: 'bealima',
    avatar: generateRealPersonAvatar('women'),
    bio: 'Especialista em ficção criativa',
    isFollowing: false
  }
];

export default function HomePage() {
  const [posts, setPosts] = useState(mockPosts);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Função para carregar dados do usuário
  const loadUserData = () => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedUser = JSON.parse(savedProfile);
        setCurrentUser({
          id: parsedUser.id || 'user-1',
          name: parsedUser.name || parsedUser.username || 'Usuário',
          username: parsedUser.username || 'usuario',
          photoUrl: parsedUser.avatar || parsedUser.photoUrl || generateRealPersonAvatar('men'),
          avatar: parsedUser.avatar || parsedUser.photoUrl || generateRealPersonAvatar('men'),
          level: parsedUser.level || 1,
          score: parsedUser.score || 0,
          bio: parsedUser.bio || 'Mentiroso iniciante'
        });
      } catch (error) {
        console.error('Error parsing user profile:', error);
        // Criar usuário padrão em caso de erro
        setCurrentUser({
          id: 'user-1',
          name: 'Usuário',
          username: 'usuario',
          photoUrl: generateRealPersonAvatar('men'),
          avatar: generateRealPersonAvatar('men'),
          level: 1,
          score: 0,
          bio: 'Mentiroso iniciante'
        });
      }
    } else {
      // Criar usuário padrão
      const defaultUser = {
        id: 'user-1',
        name: 'Usuário',
        username: 'usuario',
        photoUrl: generateRealPersonAvatar('men'),
        avatar: generateRealPersonAvatar('men'),
        level: 1,
        score: 0,
        bio: 'Mentiroso iniciante'
      };
      setCurrentUser(defaultUser);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Carregar dados inicialmente
    loadUserData();

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProfile') {
        loadUserData();
      }
    };

    // Escutar evento customizado para mudanças no mesmo tab
    const handleProfileUpdate = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handlePostUpdate = useCallback((updatedPost: any) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  }, []);

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
          
          {/* Campo de criar postagem */}
          <CreatePostInline 
            onPostCreated={() => {
              // Recarregar posts quando uma nova postagem for criada
              window.location.reload();
            }}
          />
          
          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Suspense 
                key={post.id} 
                fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}
              >
                <InstagramPost
                  post={post}
                  index={index}
                  onUpdate={handlePostUpdate}
                />
              </Suspense>
            ))}
          </div>
        </div>

        {/* Barra Lateral */}
        <div className="hidden lg:block">
          {/* Perfil do usuário atual */}
          {currentUser && (
            <div className="mb-6">
              <Suspense fallback={<div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
                <UserCard
                  user={currentUser}
                  showFollowButton={false}
                />
              </Suspense>
            </div>
          )}

          {/* Sugestões */}
          <Suspense fallback={<div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
            <SuggestionsSection />
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
            
            <div className="space-y-3">
              {suggestedUsers.map(user => (
                <Suspense 
                  key={user.id} 
                  fallback={<div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}
                >
                  <UserCard
                    user={user}
                    showFollowButton={true}
                  />
                </Suspense>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}