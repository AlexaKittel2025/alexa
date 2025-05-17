'use client';

import InstagramPost from '@/components/Post/InstagramPost';
import UserCard from '@/components/UserCard';
import SuggestionCard from '@/components/SuggestionCard';
import Stories from '@/components/Stories';
import { useState, useEffect } from 'react';
import { generateRealPersonAvatar, generatePostImage } from '@/utils/avatarUtils';

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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
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
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
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
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
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
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
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
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 horas atrás
    likedByMe: false,
    saved: false
  }
];

// Mock de usuários sugeridos com avatares reais
const suggestedUsers = [
  {
    id: '6',
    name: 'Juliana Pereira',
    username: 'jupereira',
    avatar: generateRealPersonAvatar('women'),
    bio: 'Contadora de histórias improváveis e eventos que definitivamente aconteceram',
    isFollowing: false,
    level: 12,
    points: 2845
  },
  {
    id: '7',
    name: 'Roberto Alves',
    username: 'robertoalves',
    avatar: generateRealPersonAvatar('men'),
    bio: 'Especialista em mentiras criativas e verdades alternativas',
    isFollowing: false,
    level: 8,
    points: 1567
  },
  {
    id: '8',
    name: 'Fernanda Lima',
    username: 'fernandalima',
    avatar: generateRealPersonAvatar('women'),
    bio: 'Inventora de fatos alternativos e realidades paralelas',
    isFollowing: false,
    level: 15,
    points: 3421
  },
  {
    id: '9',
    name: 'Lucas Ferreira',
    username: 'lucasferreira',
    avatar: generateRealPersonAvatar('men'),
    bio: 'Mestre em histórias impossíveis que aconteceram comigo ontem',
    isFollowing: false,
    level: 10,
    points: 2103
  },
  {
    id: '10',
    name: 'Beatriz Costa',
    username: 'beatrizcosta',
    avatar: generateRealPersonAvatar('women'),
    bio: 'Criadora de mundos imaginários onde tudo é verdade',
    isFollowing: false,
    level: 9,
    points: 1789
  }
];

export default function HomePage() {
  const [posts, setPosts] = useState(mockPosts);
  const [users, setUsers] = useState(suggestedUsers);

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likedByMe: !post.likedByMe,
              likes: post.likedByMe ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleComment = (postId: string, comment: string) => {
    console.log(`Comentário no post ${postId}: ${comment}`);
    // Aqui você implementaria a lógica para adicionar o comentário
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, saved: !post.saved }
          : post
      )
    );
  };

  const handleFollow = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  const handleShare = (postId: string) => {
    console.log(`Compartilhar post ${postId}`);
    // Implementar lógica de compartilhamento
  };

  // Recuperar dados do usuário do localStorage
  const [currentUser, setCurrentUser] = useState({
    id: 'current',
    name: 'Você',
    username: 'seuusername',
    avatar: generateRealPersonAvatar(),
    email: 'usuario@mentei.com',
    level: 1,
    score: 0,
    bio: 'Contador de histórias incríveis',
    isOnline: true
  });

  // Carregar dados do perfil do localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setCurrentUser(prev => ({
        ...prev,
        name: profile.name || prev.name,
        username: profile.username || prev.username,
        avatar: profile.avatar || prev.avatar,
        level: profile.level || prev.level,
        score: profile.points || prev.score,
        bio: profile.bio || prev.bio,
      }));
    }

    // Adicionar listener para atualizações do perfil
    const handleProfileUpdate = () => {
      const updatedProfile = localStorage.getItem('userProfile');
      if (updatedProfile) {
        const profile = JSON.parse(updatedProfile);
        setCurrentUser(prev => ({
          ...prev,
          name: profile.name || prev.name,
          username: profile.username || prev.username,
          avatar: profile.avatar || prev.avatar,
          level: profile.level || prev.level,
          score: profile.points || prev.score,
          bio: profile.bio || prev.bio,
        }));
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Feed de Posts */}
        <div className="lg:col-span-3">
          {/* Stories */}
          <div className="mb-8">
            <Stories />
          </div>
          
          {/* Posts */}
          <div className="space-y-8">
            {posts.map(post => (
              <InstagramPost
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={() => handleLike(post.id)}
                onComment={(comment) => handleComment(post.id, comment)}
                onSave={() => handleSave(post.id)}
                onShare={() => handleShare(post.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar - Sugestões */}
        <div className="lg:col-span-2">
          <div className="sticky top-4">
            {/* Perfil do Usuário Atual */}
            <div className="mb-6">
              <UserCard
                user={currentUser}
                showFollowButton={false}
                onFollow={() => {}}
              />
            </div>

            {/* Sugestões para Seguir */}
            <div className="bg-neutral-50 dark:bg-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-4">
                Sugestões para você
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {users.map(user => (
                  <SuggestionCard
                    key={user.id}
                    user={user}
                    onFollow={() => handleFollow(user.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}