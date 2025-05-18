'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaSearch, FaUser, FaHashtag, FaFire, FaTimes, FaSpinner } from 'react-icons/fa';
import { BiNews } from 'react-icons/bi';
import Link from 'next/link';
import debounce from 'lodash.debounce';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SearchResults {
  users: any[];
  posts: any[];
  tags: any[];
  totalResults: number;
}

type SearchTab = 'all' | 'users' | 'posts' | 'tags';
type SortBy = 'relevance' | 'recent' | 'popular';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<SearchResults>({
    users: [],
    posts: [],
    tags: [],
    totalResults: 0
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [trending, setTrending] = useState<any>({
    trendingTags: [],
    trendingUsers: [],
    trendingPosts: []
  });

  // Função de busca
  const performSearch = async (searchQuery: string, tab: SearchTab = activeTab) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&type=${tab}&sortBy=${sortBy}`
      );
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar sugestões
  const fetchSuggestions = useCallback(
    debounce(async (value: string) => {
      if (value.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value)}`);
        const data = await response.json();
        
        if (data.success) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      }
    }, 300),
    []
  );

  // Buscar trending na inicialização
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/search/trending');
        const data = await response.json();
        
        if (data.success) {
          setTrending(data);
        }
      } catch (error) {
        console.error('Erro ao buscar trending:', error);
      }
    };

    fetchTrending();
  }, []);

  // Executar busca quando query mudar
  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam, activeTab, sortBy]);

  // Atualizar sugestões quando query mudar
  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const renderUserResult = (user: any) => (
    <Link href={`/perfil/${user.id}`} key={user.id}>
      <div className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <img
          src={user.avatar || generateRealPersonAvatar(['men', 'women'][Math.random() < 0.5 ? 0 : 1])}
          alt={user.displayName}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {user.displayName}
            {user.isPro && <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">PRO</span>}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Nível {user.level} • {user.score} pontos • {user.postsCount} mentiras
          </p>
          {user.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{user.bio}</p>
          )}
        </div>
      </div>
    </Link>
  );

  const renderPostResult = (post: any) => (
    <Link href={`/post/${post.id}`} key={post.id}>
      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <div className="flex items-start">
          <img
            src={post.author.avatar || generateRealPersonAvatar(['men', 'women'][Math.random() < 0.5 ? 0 : 1])}
            alt={post.author.displayName}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="font-semibold text-gray-900 dark:text-white">{post.author.displayName}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                @{post.author.username} • {formatDistanceToNow(new Date(post.createdAt), { locale: ptBR, addSuffix: true })}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{post.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="mt-2 rounded-lg max-h-60 object-cover"
              />
            )}
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{post.reactions} reações</span>
              <span>{post.comments} comentários</span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex space-x-2">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-purple-600 dark:text-purple-400">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const renderTagResult = (tag: any) => (
    <Link href={`/tag/${tag.name}`} key={tag.id}>
      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-purple-600 dark:text-purple-400 text-lg">
              #{tag.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {tag.useCount} posts
              {tag.trendingScore && tag.trendingScore > 100 && (
                <span className="ml-2 text-orange-500">
                  <FaFire className="inline" /> Em alta
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

  const hasResults = results.users.length > 0 || results.posts.length > 0 || results.tags.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Barra de busca */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Buscar usuários, posts ou tags..."
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults({ users: [], posts: [], tags: [], totalResults: 0 });
                  router.push('/search');
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Sugestões */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Tabs e Filtros */}
        {queryParam && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                    activeTab === 'users'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FaUser className="mr-2" /> Usuários
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                    activeTab === 'posts'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <BiNews className="mr-2" /> Posts
                </button>
                <button
                  onClick={() => setActiveTab('tags')}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                    activeTab === 'tags'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FaHashtag className="mr-2" /> Tags
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                <option value="relevance">Relevância</option>
                <option value="recent">Mais recente</option>
                <option value="popular">Mais popular</option>
              </select>
            </div>

            {hasResults && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {results.totalResults} resultados encontrados
              </p>
            )}
          </div>
        )}

        {/* Resultados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {loading ? (
            <div className="flex justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-purple-600" />
            </div>
          ) : queryParam && !hasResults ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum resultado encontrado para "{queryParam}"
              </p>
            </div>
          ) : hasResults ? (
            <div>
              {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                <div>
                  <h2 className="font-semibold text-lg px-4 py-3 border-b dark:border-gray-700">
                    Usuários
                  </h2>
                  {results.users.map(renderUserResult)}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                <div>
                  <h2 className="font-semibold text-lg px-4 py-3 border-b dark:border-gray-700">
                    Posts
                  </h2>
                  {results.posts.map(renderPostResult)}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'tags') && results.tags.length > 0 && (
                <div>
                  <h2 className="font-semibold text-lg px-4 py-3 border-b dark:border-gray-700">
                    Tags
                  </h2>
                  {results.tags.map(renderTagResult)}
                </div>
              )}
            </div>
          ) : (
            /* Página inicial com trending */
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Trending no Mentei
              </h2>

              {/* Tags em alta */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-900 dark:text-white">
                  <FaFire className="mr-2 text-orange-500" /> Tags em alta
                </h3>
                <div className="flex flex-wrap gap-3">
                  {trending.trendingTags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.name}`}
                      className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Usuários populares */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                  Usuários populares
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trending.trendingUsers.map((user: any) => renderUserResult(user))}
                </div>
              </div>

              {/* Posts populares */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                  Posts populares
                </h3>
                <div className="space-y-4">
                  {trending.trendingPosts.map((post: any) => renderPostResult(post))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}