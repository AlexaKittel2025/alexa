'use client';
;
;
import { ChevronDownIcon, CogIcon, UserAddIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import Image from 'next/image';
import PostGrid from '@/components/Post/PostGrid';

// Mock data
const mockUser = {
  id: '1',
  username: 'joaosilva',
  name: 'João Silva',
  avatar: '/images/avatar-placeholder.jpg',
  bio: 'Contador de histórias fictícias | Viajante imaginário | ✨ Criador de mentiras divertidas',
  followers: 1548,
  following: 892,
  posts: 123,
  isVerified: true,
  website: 'mentei.app/joaosilva'
};

const mockPosts = [
  { id: '1', image: '/images/post-placeholder.jpg', likes: 234, comments: 12, content: '' },
  { id: '2', content: 'Encontrei um dragão no meu quintal hoje!', likes: 567, comments: 34 },
  { id: '3', image: '/images/post-placeholder.jpg', likes: 890, comments: 56, content: '' },
  { id: '4', content: 'Meu gato aprendeu a falar francês', likes: 345, comments: 23 },
  { id: '5', image: '/images/post-placeholder.jpg', likes: 678, comments: 45, content: '' },
  { id: '6', content: 'Descobri que sou descendente de piratas', likes: 901, comments: 67 },
];

type TabType = 'posts' | 'saved' | 'tagged';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const tabs = [
    { id: 'posts' as TabType, label: 'PUBLICAÇÕES', icon: '📄' },
    { id: 'saved' as TabType, label: 'SALVOS', icon: '🔖' },
    { id: 'tagged' as TabType, label: 'MARCADOS', icon: '👤' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-start md:items-center gap-8 mb-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={mockUser.avatar}
                alt={mockUser.name}
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-xl font-light">{mockUser.username}</h1>
              {mockUser.isVerified && (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              )}
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
                
                <button className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200">
                  Mensagem
                </button>
                
                <button className="p-1.5 rounded-lg hover:bg-gray-100">
                  <UserAddIcon className="w-5 h-5" />
                </button>
                
                <button className="p-1.5 rounded-lg hover:bg-gray-100">
                  <ChevronDownIcon className="w-5 h-5" />
                </button>
              </div>
              
              <button className="p-1.5 rounded-lg hover:bg-gray-100 ml-auto">
                <CogIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-4">
              <div>
                <span className="font-semibold">{mockUser.posts}</span>
                <span className="text-gray-700"> publicações</span>
              </div>
              <button className="hover:underline">
                <span className="font-semibold">{mockUser.followers.toLocaleString('pt-BR')}</span>
                <span className="text-gray-700"> seguidores</span>
              </button>
              <button className="hover:underline">
                <span className="font-semibold">{mockUser.following.toLocaleString('pt-BR')}</span>
                <span className="text-gray-700"> seguindo</span>
              </button>
            </div>

            {/* Bio */}
            <div>
              <p className="font-semibold">{mockUser.name}</p>
              <p className="whitespace-pre-wrap">{mockUser.bio}</p>
              {mockUser.website && (
                <a href={`https://${mockUser.website}`} className="text-blue-900 font-medium">
                  {mockUser.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="flex justify-around py-3 border-y border-gray-200 md:hidden">
          <div className="text-center">
            <p className="font-semibold">{mockUser.posts}</p>
            <p className="text-xs text-gray-500">publicações</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{mockUser.followers.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-gray-500">seguidores</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{mockUser.following.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-gray-500">seguindo</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-4 py-4 text-xs font-medium tracking-widest transition-colors border-t-2 ${
                activeTab === tab.id
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="pb-20">
        {activeTab === 'posts' && <PostGrid posts={mockPosts} />}
        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma publicação salva ainda</p>
          </div>
        )}
        {activeTab === 'tagged' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma marcação ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
