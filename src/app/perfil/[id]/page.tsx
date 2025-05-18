'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PostCard from '@/components/Post/PostCard';
import UserRewards from '@/components/profile/UserRewards';
import CoinSystem from '@/components/profile/CoinSystem';
import Achievements from '@/components/profile/Achievements';
import AchievementsSystem from '@/components/AchievementsSystem';
import UserLevelProgress from '@/components/profile/UserLevelProgress';
import FollowButton from '@/components/FollowButton';
import FollowModal from '@/components/FollowModal';
import PrivateChatButton from '@/components/Chat/PrivateChatButton';
import Image from 'next/image';
import { FaUser, FaCalendarAlt, FaTrophy, FaHeart, FaUsers, FaUserFriends } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';

interface UserData {
  uid: string;
  displayName: string;
  photoURL: string | null;
  email: string;
  createdAt: any;
  rank?: number;
  score?: number;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
}

interface Post {
  id: string;
  uid: string;
  displayName: string;
  photoURL: string | null;
  content: string;
  tags: string[];
  imageUrl: string | null;
  reactions: {
    quaseAcreditei: number;
    hahaha: number;
    mentiraEpica: number;
  };
  createdAt: any;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PerfilPage({ params }: PageProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [id, setId] = useState<string>('');
  
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);
  
  const [user, setUser] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'sobre' | 'conquistas' | 'moedas'>('posts');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers');
  const [followModalTitle, setFollowModalTitle] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchUserData = async () => {
      try {
        // Buscar dados do usuário
        const response = await fetch(`/api/users/${id}`);
        const userData = await response.json();
        
        if (!userData) {
          router.push('/');
          return;
        }
        
        setUser({
          uid: userData.id,
          displayName: userData.display_name || userData.username,
          photoURL: userData.avatar || userData.image || generateRealPersonAvatar(['men', 'women'][Math.random() < 0.5 ? 0 : 1]),
          email: userData.email,
          createdAt: userData.createdAt,
          rank: userData.rank,
          score: userData.pontuacaoTotal || userData.score || 0,
          bio: userData.bio
        });
        
        // Buscar contadores de follow
        const followResponse = await fetch(`/api/users/${id}/follow`);
        const followData = await followResponse.json();
        
        if (followData) {
          setFollowersCount(followData.followersCount || 0);
          setFollowingCount(followData.followingCount || 0);
        }
        
        // Buscar postagens do usuário
        const postsQuery = query(
          collection(db, 'posts'),
          where('authorId', '==', id),
          orderBy('createdAt', 'desc')
        );
        
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            uid: data.authorId || id,
            displayName: data.authorName || '',
            photoURL: data.authorPhoto || null,
            content: data.content || '',
            tags: data.tags || [],
            imageUrl: data.imageUrl || null,
            reactions: data.reactions || {
              quaseAcreditei: 0,
              hahaha: 0,
              mentiraEpica: 0
            },
            createdAt: data.createdAt
          };
        });
        
        setPosts(userPosts);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, router]);

  const handleFollowChange = (isFollowing: boolean, counts: { followersCount: number; followingCount: number }) => {
    setFollowersCount(counts.followersCount);
    setFollowingCount(counts.followingCount);
  };

  const openFollowModal = (type: 'followers' | 'following') => {
    setFollowModalType(type);
    setFollowModalTitle(type === 'followers' ? 'Seguidores' : 'Seguindo');
    setShowFollowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Usuário não encontrado</h1>
          <p className="mt-2 text-gray-600">O perfil que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header do perfil com foto, nome, etc. */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="relative h-48 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="absolute -bottom-16 left-8">
            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                  <FaUser className="text-purple-600 dark:text-purple-400 text-4xl" />
                </div>
              )}
            </div>
          </div>
          
          {/* Botões de seguir e chat */}
          {currentUser && currentUser.id !== id && (
            <div className="absolute top-4 right-4 flex gap-3">
              <FollowButton
                userId={id}
                username={user.displayName}
                onFollowChange={handleFollowChange}
                size="md"
              />
              <PrivateChatButton
                userId={id}
                username={user.displayName}
              />
            </div>
          )}
        </div>
        
        <div className="pt-20 pb-6 px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName}</h1>
          
          {user.bio && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">{user.bio}</p>
          )}
          
          <div className="mt-4 flex flex-wrap gap-6">
            <button
              onClick={() => openFollowModal('followers')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FaUsers className="mr-2" />
              <span className="font-semibold">{followersCount}</span>
              <span className="ml-1">seguidores</span>
            </button>
            
            <button
              onClick={() => openFollowModal('following')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FaUserFriends className="mr-2" />
              <span className="font-semibold">{followingCount}</span>
              <span className="ml-1">seguindo</span>
            </button>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaCalendarAlt className="mr-2" />
              <span>
                Membro desde {user.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('pt-BR') 
                  : 'data desconhecida'}
              </span>
            </div>
            
            {user.rank && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaTrophy className="mr-2 text-yellow-500" />
                <span>Ranking #{user.rank}</span>
              </div>
            )}
            
            {typeof user.score === 'number' && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaHeart className="mr-2 text-red-500" />
                <span>{user.score} pontos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs de navegação */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2 px-4 ${
              activeTab === 'posts'
                ? 'border-b-2 border-purple-500 text-purple-700 dark:text-purple-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Mentiras
          </button>
          <button
            onClick={() => setActiveTab('sobre')}
            className={`py-2 px-4 ${
              activeTab === 'sobre'
                ? 'border-b-2 border-purple-500 text-purple-700 dark:text-purple-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Sobre
          </button>
          <button
            onClick={() => setActiveTab('conquistas')}
            className={`py-2 px-4 ${
              activeTab === 'conquistas'
                ? 'border-b-2 border-purple-500 text-purple-700 dark:text-purple-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Conquistas
          </button>
          <button
            onClick={() => setActiveTab('moedas')}
            className={`py-2 px-4 ${
              activeTab === 'moedas'
                ? 'border-b-2 border-purple-500 text-purple-700 dark:text-purple-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Moedas
          </button>
        </div>
      </div>
      
      {/* Conteúdo das tabs */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} {...post} />
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">Este usuário ainda não compartilhou nenhuma mentira.</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'sobre' && (
        <div className="grid grid-cols-1 gap-6">
          <UserRewards userId={id} />
        </div>
      )}
      
      {activeTab === 'conquistas' && (
        <div className="grid grid-cols-1 gap-6">
          <UserLevelProgress userId={id} />
          <AchievementsSystem userId={id} />
        </div>
      )}
      
      {activeTab === 'moedas' && (
        <div className="grid grid-cols-1 gap-6">
          <CoinSystem userId={id} />
        </div>
      )}
      
      {/* Modal de seguidores/seguindo */}
      <FollowModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        title={followModalTitle}
        userId={id}
        type={followModalType}
      />
    </div>
  );
}