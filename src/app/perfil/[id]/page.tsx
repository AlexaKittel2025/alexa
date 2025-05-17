'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import MainLayout from '@/components/Layout/MainLayout';
import PostCard from '@/components/Post/PostCard';
import UserRewards from '@/components/Profile/UserRewards';
import CoinSystem from '@/components/Profile/CoinSystem';
import Achievements from '@/components/Profile/Achievements';
import Image from 'next/image';
import { FaUser, FaCalendarAlt, FaTrophy, FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface UserData {
  uid: string;
  displayName: string;
  photoURL: string | null;
  email: string;
  createdAt: any;
  rank?: number;
  score?: number;
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

export default function PerfilPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'sobre' | 'conquistas' | 'moedas'>('posts');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', id));
        
        if (!userDoc.exists()) {
          router.push('/');
          return;
        }
        
        setUser({
          uid: userDoc.id,
          ...userDoc.data()
        } as UserData);
        
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
        console.error('Erro ao carregar perfil:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Usuário não encontrado</h1>
            <p className="mt-2 text-gray-600">O perfil que você está procurando não existe.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header do perfil com foto, nome, etc. */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="relative h-48 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="absolute -bottom-16 left-8">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden">
              {user.photoURL ? (
                <Image 
                  src={user.photoURL}
                  alt={user.displayName}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-purple-200 flex items-center justify-center">
                  <FaUser className="text-purple-600 text-4xl" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-6 px-8">
          <h1 className="text-2xl font-bold text-gray-800">{user.displayName}</h1>
          
          <div className="mt-4 flex flex-wrap gap-6">
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="mr-2" />
              <span>
                Membro desde {user.createdAt?.toDate 
                  ? new Date(user.createdAt.toDate()).toLocaleDateString('pt-BR') 
                  : 'data desconhecida'}
              </span>
            </div>
            
            {user.rank && (
              <div className="flex items-center text-gray-600">
                <FaTrophy className="mr-2 text-yellow-500" />
                <span>Ranking #{user.rank}</span>
              </div>
            )}
            
            {user.score !== undefined && (
              <div className="flex items-center text-gray-600">
                <FaHeart className="mr-2 text-red-500" />
                <span>{user.score} pontos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs de navegação */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2 px-4 ${
              activeTab === 'posts'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mentiras
          </button>
          <button
            onClick={() => setActiveTab('sobre')}
            className={`py-2 px-4 ${
              activeTab === 'sobre'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sobre
          </button>
          <button
            onClick={() => setActiveTab('conquistas')}
            className={`py-2 px-4 ${
              activeTab === 'conquistas'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Conquistas
          </button>
          <button
            onClick={() => setActiveTab('moedas')}
            className={`py-2 px-4 ${
              activeTab === 'moedas'
                ? 'border-b-2 border-purple-500 text-purple-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
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
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Este usuário ainda não compartilhou nenhuma mentira.</p>
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
          <Achievements userId={id} />
        </div>
      )}
      
      {activeTab === 'moedas' && (
        <div className="grid grid-cols-1 gap-6">
          <CoinSystem userId={id} />
        </div>
      )}
    </MainLayout>
  );
} 