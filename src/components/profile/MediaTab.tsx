import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post as PostType } from '../../types';

interface MediaItem {
  id: string;
  post_id: string;
  media_type: string;
  media_urls: string[];
  created_at: string;
  post: {
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      display_name: string;
      photo_url: string;
    }
  }
}

interface MediaTabProps {
  userId: string;
  isCurrentUser: boolean;
}

const MediaTab: React.FC<MediaTabProps> = ({ userId, isCurrentUser }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMedia = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/users/${userId}/media?page=${pageNum}&limit=12`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar mídia');
      }
      
      const data = await response.json();
      
      if (pageNum === 1) {
        setMediaItems(data.mediaPosts);
      } else {
        setMediaItems(prev => [...prev, ...data.mediaPosts]);
      }
      
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      
      setError(err instanceof Error ? err.message : 'Erro ao carregar mídia');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMedia(1);
    }
  }, [userId]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchMedia(page + 1);
    }
  };

  return (
    <div>
      {loading && mediaItems.length === 0 ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            {isCurrentUser 
              ? "Você ainda não compartilhou nenhuma imagem. Adicione imagens aos seus posts!" 
              : "Este usuário ainda não compartilhou nenhuma imagem."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map(item => (
              <Link 
                key={item.id}
                to={`/post/${item.post_id}`}
                className="block relative group overflow-hidden rounded-lg"
              >
                {item.media_type === 'image' && (
                  <div className="aspect-square">
                    <img 
                      src={item.media_urls[0]} 
                      alt={item.post.content.substring(0, 30) || "Imagem"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`px-6 py-2 rounded-full border ${
                  loading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-300'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando...
                  </span>
                ) : (
                  'Carregar mais'
                )}
              </button>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MediaTab; 