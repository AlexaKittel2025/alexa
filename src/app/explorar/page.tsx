'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFire, FaHashtag, FaTrophy, FaChartLine, FaUserFriends, FaSearch } from 'react-icons/fa';
import { SearchIcon, HashtagIcon, UserIcon } from '@heroicons/react/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InstagramPost from '@/components/Post/InstagramPost';
import UserCard from '@/components/UserCard';
import { generateRealPersonAvatar, generatePostImage } from '@/utils/avatarUtils';
import PostCard from '@/components/Post/PostCard';

// Mock data para desenvolvimento
const mockTrendingPosts = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Pedro Costa',
      username: 'pedrocosta',
      avatar: generateRealPersonAvatar('men')
    },
    content: 'Ontem eu estava caminhando na praia e encontrei uma garrafa com uma mensagem dentro. Era um mapa do tesouro pirata! Segui as instruções e encontrei um baú cheio de bitcoins enterrado na areia. Agora sou milionário! 🏴‍☠️💰',
    image: generatePostImage(),
    likes: 342,
    comments: 45,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    likedByMe: false,
    saved: false,
    tags: ['aventura', 'tesouro', 'bitcoin']
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Ana Silva',
      username: 'anasilva',
      avatar: generateRealPersonAvatar('women')
    },
    content: 'Meu gato aprendeu a falar e agora ele dá aulas de filosofia na universidade. Os alunos adoram e ele já tem um canal no YouTube com 2 milhões de inscritos. 🐱🎓',
    image: generatePostImage(),
    likes: 256,
    comments: 67,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likedByMe: false,
    saved: false,
    tags: ['animais', 'educação', 'youtube']
  }
];

const mockTopUsers = [
  {
    id: '3',
    name: 'Carlos Mendes',
    username: 'carlosmendes',
    avatar: generateRealPersonAvatar('men'),
    score: 8750,
    followers: 1234,
    bio: 'Mentiroso profissional há 5 anos',
    level: 15,
    isFollowing: false
  },
  {
    id: '4',
    name: 'Beatriz Lima',
    username: 'bealima',
    avatar: generateRealPersonAvatar('women'),
    score: 7890,
    followers: 987,
    bio: 'Criando histórias impossíveis desde 2020',
    level: 12,
    isFollowing: false
  },
  {
    id: '5',
    name: 'João Santos',
    username: 'joaosantos',
    avatar: generateRealPersonAvatar('men'),
    score: 6543,
    followers: 756,
    bio: 'Especialista em exageros criativos',
    level: 10,
    isFollowing: false
  }
];

const mockCategories = [
  { name: 'Aventuras', icon: '🏔️', count: 234, color: 'bg-blue-100 text-blue-800' },
  { name: 'Trabalho', icon: '💼', count: 189, color: 'bg-gray-100 text-gray-800' },
  { name: 'Família', icon: '👨‍👩‍👧‍👦', count: 167, color: 'bg-green-100 text-green-800' },
  { name: 'Tecnologia', icon: '💻', count: 145, color: 'bg-purple-100 text-purple-800' },
  { name: 'Animais', icon: '🐾', count: 132, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Esportes', icon: '⚽', count: 98, color: 'bg-red-100 text-red-800' }
];

export default function ExplorarPage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'users' | 'categories' | 'search'>('trending');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(mockTrendingPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    tags: []
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchActiveTab, setSearchActiveTab] = useState<'posts' | 'users' | 'tags'>('posts');

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePostUpdate = (updatedPost: any) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setActiveTab('search');

    try {
      // Buscar em paralelo
      const [postsResponse, usersResponse, tagsResponse] = await Promise.all([
        fetch(`/api/posts?search=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/users?search=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/tags?search=${encodeURIComponent(searchQuery)}`)
      ]);

      const [postsData, usersData, tagsData] = await Promise.all([
        postsResponse.json(),
        usersResponse.json(),
        tagsResponse.json()
      ]);

      setSearchResults({
        posts: postsData.posts || [],
        users: usersData.users || [],
        tags: tagsData.tags || []
      });
    } catch (error) {
      // Usar dados mock em caso de erro
      setSearchResults({
        posts: [
          {
            id: '1',
            user: {
              id: '1',
              name: 'João Silva',
              username: 'joaosilva',
              avatar: generateRealPersonAvatar('men')
            },
            content: `Post contendo "${searchQuery}"`,
            likes: 42,
            comments: 5,
            createdAt: new Date(),
            likedByMe: false,
            saved: false
          }
        ],
        users: [
          {
            id: '1',
            name: 'João Silva',
            username: 'joaosilva',
            avatar: generateRealPersonAvatar('men'),
            bio: 'Mentiroso profissional',
            followers: 150,
            following: 75,
            isFollowing: false
          }
        ],
        tags: [
          {
            id: '1',
            name: searchQuery,
            count: 15
          }
        ]
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const TabButton = ({ tab, label, icon }: { tab: 'posts' | 'users' | 'tags'; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setSearchActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
        searchActiveTab === tab
          ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Explorar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Descubra as mentiras mais criativas e os mentirosos mais talentosos
        </p>
      </div>

      {/* Barra de pesquisa */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar posts, usuários ou tags..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Navegação de Tabs */}
      <div className="flex space-x-8 mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('trending')}
          className={`pb-4 px-2 text-sm font-medium transition-colors ${
            activeTab === 'trending'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FaFire className="inline-block mr-2" />
          Em Alta
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-2 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FaUserFriends className="inline-block mr-2" />
          Top Mentirosos
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-2 text-sm font-medium transition-colors ${
            activeTab === 'categories'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FaHashtag className="inline-block mr-2" />
          Categorias
        </button>
        {searchQuery && (
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FaSearch className="inline-block mr-2" />
            Resultados da Pesquisa
          </button>
        )}
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'trending' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts em alta */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaFire className="text-orange-500 mr-2" />
              Mentiras em Alta
            </h2>
            <div className="space-y-4">
              {posts.map((post, index) => (
                <InstagramPost
                  key={post.id}
                  post={post}
                  index={index}
                  onUpdate={handlePostUpdate}
                />
              ))}
            </div>
          </div>

          {/* Barra lateral com estatísticas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Estatísticas de Hoje
            </h3>
            <div className="space-y-3">
              <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Mentiras Hoje
                </h3>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                  2,345
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Usuários Ativos
                </h3>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  5,678
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/40 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Reações Hoje
                </h3>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                  12,456
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top mentirosos */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaTrophy className="text-yellow-500 mr-2" />
              Top Mentirosos da Semana
            </h2>
            <div className="space-y-4">
              {mockTopUsers.map((user, index) => (
                <div key={user.id} className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <UserCard
                    user={user}
                    showFollowButton={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar com link para ranking completo */}
          <div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Quer ver mais?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Confira o ranking completo dos melhores mentirosos
              </p>
              <Link
                href="/ranking"
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Ver Ranking Completo
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaHashtag className="text-purple-500 mr-2" />
            Categorias Populares
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {mockCategories.map((category) => (
              <Link
                key={category.name}
                href={`/tag/${category.name.toLowerCase()}`}
                className={`${category.color} rounded-lg p-4 hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm opacity-80">{category.count} mentiras</p>
                    </div>
                  </div>
                  <FaChartLine className="opacity-70" />
                </div>
              </Link>
            ))}
          </div>

          {/* Link para explorar tags */}
          <Link
            href="/explorar/tags"
            className="block w-full text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 rounded-lg transition-colors"
          >
            Ver Todas as Tags
          </Link>
        </div>
      )}

      {activeTab === 'search' && (
        <div>
          {searchLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div>
              {/* Tabs de resultados de pesquisa */}
              <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                <TabButton tab="posts" label="Posts" icon={<SearchIcon className="w-5 h-5" />} />
                <TabButton tab="users" label="Usuários" icon={<UserIcon className="w-5 h-5" />} />
                <TabButton tab="tags" label="Tags" icon={<HashtagIcon className="w-5 h-5" />} />
              </div>

              {/* Resultados da pesquisa */}
              <div>
                {searchActiveTab === 'posts' && (
                  <div className="space-y-4">
                    {searchResults.posts.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Nenhum post encontrado para "{searchQuery}"
                      </p>
                    ) : (
                      searchResults.posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    )}
                  </div>
                )}

                {searchActiveTab === 'users' && (
                  <div className="space-y-4">
                    {searchResults.users.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Nenhum usuário encontrado para "{searchQuery}"
                      </p>
                    ) : (
                      searchResults.users.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          showFollowButton={true}
                        />
                      ))
                    )}
                  </div>
                )}

                {searchActiveTab === 'tags' && (
                  <div className="space-y-4">
                    {searchResults.tags.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Nenhuma tag encontrada para "{searchQuery}"
                      </p>
                    ) : (
                      searchResults.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/tag/${tag.name}`}
                          className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <HashtagIcon className="text-purple-600 dark:text-purple-400 w-5 h-5" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {tag.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}