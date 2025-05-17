'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaCamera, FaUser, FaTimes, FaCog } from 'react-icons/fa';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';
import PostModal from '@/components/PostModal';
import FollowModal from '@/components/FollowModal';
import { loadPostData, isPostSaved } from '@/utils/persistenceUtils';

// Mock de dados dos usuários
const mockUsers = {
  'mariasantos': {
    id: '2',
    name: 'Maria Santos',
    username: 'mariasantos',
    avatar: generateRealPersonAvatar('women'),
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1500&q=80',
    bio: 'Atleta profissional de sofá e contadora de histórias improváveis',
    level: 10,
    points: 1950,
    isPro: false,
    followers: 342,
    following: 187,
    posts: 23,
    isFollowing: false
  },
  'joaosilva': {
    id: '1',
    name: 'João Silva',
    username: 'joaosilva',
    avatar: generateRealPersonAvatar('men'),
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1500&q=80',
    bio: 'Mestre em mentiras criativas e engenheiro de histórias impossíveis',
    level: 15,
    points: 3200,
    isPro: true,
    followers: 1542,
    following: 287,
    posts: 145,
    isFollowing: false
  },
  'pedrocosta': {
    id: '3',
    name: 'Pedro Costa',
    username: 'pedrocosta',
    avatar: generateRealPersonAvatar('men'),
    coverImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1500&q=80',
    bio: 'Viajante do tempo e descobridor de tesouros imaginários',
    level: 8,
    points: 1200,
    isPro: false,
    followers: 245,
    following: 312,
    posts: 67,
    isFollowing: false
  }
};

interface ProfileTab {
  id: string;
  label: string;
  count?: number;
}

// Mock de posts do usuário
const mockPosts = [
  {
    id: '1',
    content: 'Acabei de voltar de Marte. A viagem foi tranquila, apenas 3 horas de voo.',
    image: 'https://picsum.photos/400/400?random=1',
    likes: 45,
    comments: 12,
    createdAt: new Date()
  },
  {
    id: '2',
    content: 'Meu café da manhã hoje: caviar, lagosta e champagne. Vida simples.',
    image: 'https://picsum.photos/400/400?random=2',
    likes: 78,
    comments: 23,
    createdAt: new Date()
  },
  {
    id: '3',
    content: 'Encontrei um unicórnio no meu quintal hoje. Ele pediu WiFi.',
    image: 'https://picsum.photos/400/400?random=3',
    likes: 123,
    comments: 34,
    createdAt: new Date()
  }
];

// Mock de seguidores
const mockFollowers = [
  {
    id: '4',
    name: 'Ana Silva',
    username: 'anasilva',
    avatar: generateRealPersonAvatar('women'),
    isFollowing: false
  },
  {
    id: '5',
    name: 'Carlos Mendes',
    username: 'carlosmendes',
    avatar: generateRealPersonAvatar('men'),
    isFollowing: true
  },
  {
    id: '6',
    name: 'Beatriz Oliveira',
    username: 'biaoliveira',
    avatar: generateRealPersonAvatar('women'),
    isFollowing: false
  },
  {
    id: '7',
    name: 'Fernando Costa',
    username: 'fernandocosta',
    avatar: generateRealPersonAvatar('men'),
    isFollowing: true
  }
];

// Mock de seguindo
const mockFollowing = [
  {
    id: '8',
    name: 'Juliana Pereira',
    username: 'jupereira',
    avatar: generateRealPersonAvatar('women'),
    isFollowing: true
  },
  {
    id: '9',
    name: 'Roberto Alves',
    username: 'robertoalves',
    avatar: generateRealPersonAvatar('men'),
    isFollowing: true
  },
  {
    id: '10',
    name: 'Fernanda Lima',
    username: 'fernandalima',
    avatar: generateRealPersonAvatar('women'),
    isFollowing: true
  }
];

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLevelModal, setShowLevelModal] = useState(false);
  
  // Verificar se é o próprio usuário
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Estados para os modais
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  
  useEffect(() => {
    // Carregar perfil do usuário
    const userProfile = mockUsers[username];
    
    if (userProfile) {
      setProfile(userProfile);
      setIsFollowing(userProfile.isFollowing);
      
      // Verificar se é o próprio perfil
      const currentUser = localStorage.getItem('userProfile');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        setIsOwnProfile(parsedUser.username === username);
      }
      
      setLoading(false);
    } else {
      // Se o usuário não existir, redirecionar para 404
      router.push('/404');
    }
  }, [username, router]);
  
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // Aqui você implementaria a lógica real de seguir/deixar de seguir
  };
  
  const handlePostClick = (post: any) => {
    // Carregar dados salvos do post
    const savedData = loadPostData(post.id);
    const enrichedPost = {
      ...post,
      likes: savedData?.likeCount || post.likes,
      user: profile
    };
    
    setSelectedPost(enrichedPost);
    setShowPostModal(true);
  };
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'followers') {
      setShowFollowersModal(true);
    } else if (tabId === 'following') {
      setShowFollowingModal(true);
    }
  };
  
  const tabs: ProfileTab[] = [
    { id: 'posts', label: 'Publicações', count: profile?.posts },
    { id: 'followers', label: 'Seguidores', count: profile?.followers },
    { id: 'following', label: 'Seguindo', count: profile?.following }
  ];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!profile) {
    return null;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header com imagem de capa */}
      <div className="relative">
        <div className="h-48 md:h-64 overflow-hidden rounded-b-lg">
          <img 
            src={profile.coverImage} 
            alt="Capa"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img 
              src={profile.avatar} 
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
            />
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="absolute top-4 right-4">
          {isOwnProfile ? (
            <Link
              href="/meu-perfil"
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaUser className="w-4 h-4" />
              Editar Perfil
            </Link>
          ) : (
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isFollowing ? 'Deixar de seguir' : 'Seguir'}
            </button>
          )}
        </div>
      </div>
      
      {/* Informações do perfil */}
      <div className="px-8 pt-20 pb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
            
            {/* Bio */}
            <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl">
              {profile.bio}
            </p>
            
            {/* Badges */}
            <div className="flex items-center gap-4 mt-4">
              {profile.isPro && (
                <button
                  onClick={() => setShowLevelModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:shadow-lg transition-shadow"
                >
                  PRO
                </button>
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Nível {profile.level}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {profile.points.toLocaleString()} pontos
              </span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-t dark:border-gray-700 mt-8">
          <nav className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="font-medium">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Conteúdo das tabs */}
        <div className="mt-8">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockPosts.map(post => {
                // Carregar dados salvos para exibir contadores atualizados
                const savedData = loadPostData(post.id);
                const displayLikes = savedData?.likeCount || post.likes;
                const displayComments = savedData?.comments?.length || post.comments;
                
                return (
                  <div 
                    key={post.id} 
                    className="relative group cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    <img 
                      src={post.image} 
                      alt=""
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">
                        <p className="text-sm font-medium">❤️ {displayLikes}</p>
                        <p className="text-sm font-medium">💬 {displayComments}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {activeTab === 'followers' && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Lista de seguidores em breve
            </div>
          )}
          
          {activeTab === 'following' && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Lista de seguindo em breve
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Status do Nível */}
      {showLevelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowLevelModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Status PRO
              </h2>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                <p className="text-3xl font-bold">Nível {profile.level}</p>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {profile.name} é um membro PRO do Mentei App com benefícios exclusivos!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Post */}
      {selectedPost && (
        <PostModal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
        />
      )}
      
      {/* Modal de Seguidores */}
      <FollowModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Seguidores"
        users={mockFollowers}
        emptyMessage="Nenhum seguidor ainda"
      />
      
      {/* Modal de Seguindo */}
      <FollowModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Seguindo"
        users={mockFollowing}
        emptyMessage="Não está seguindo ninguém ainda"
      />
    </div>
  );
}