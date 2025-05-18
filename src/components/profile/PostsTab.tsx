import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Post from '../Post';
import { PostType } from '../../types/index';
import { useAuth } from '../../context/AuthContext';
import CreatePostModal from '../CreatePostModal';

interface PostsTabProps {
  userId: string;
  isCurrentUser: boolean;
}

const PostsTab: React.FC<PostsTabProps> = ({ userId, isCurrentUser }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { currentUser } = useAuth();
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/posts/user/${userId}?page=${pageNum}&limit=5`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar posts');
      }
      
      const data = await response.json();
      
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPosts(1);
    }
  }, [userId]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handlePostCreated = (newPost: PostType) => {
    setPosts(prev => [newPost, ...prev]);
  };

  // Buscar posts salvos pelo usuário atual
  const fetchSavedPosts = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/users/saved-posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedPosts(data.savedPosts || []);
      }
    } catch (err) {
      
    }
  };

  // Manipulador de reações a um post
  const handleReaction = async (postId: string, reactionType: 'quaseAcreditei' | 'hahaha' | 'mentiraEpica') => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/posts/${postId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reaction: reactionType })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  reactions: data.reactions, 
                  userReactions: data.userReactions 
                } as PostType
              : post
          )
        );
      }
    } catch (err) {
      
    }
  };

  // Manipulador de julgamentos de um post
  const handleJudgement = async (postId: string, judgementType: 'crivel' | 'inventiva' | 'totalmentePirada') => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/posts/${postId}/judgement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ judgement: judgementType })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  judgements: data.judgements, 
                  userJudgements: data.userJudgements 
                } as PostType
              : post
          )
        );
      }
    } catch (err) {
      
    }
  };

  // Manipulador para reportar um post
  const handleReport = async (postId: string, reason: string) => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        alert('Post reportado com sucesso!');
      } else {
        alert('Erro ao reportar post. Tente novamente.');
      }
    } catch (err) {
      
      alert('Erro ao reportar post. Tente novamente.');
    }
  };

  // Manipulador para alternar salvamento de um post
  const handleToggleSavePost = async (postId: string) => {
    if (!currentUser) return;
    
    try {
      const method = savedPosts.includes(postId) ? 'DELETE' : 'POST';
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/users/saved-posts/${postId}`, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        if (method === 'POST') {
          setSavedPosts(prev => [...prev, postId]);
        } else {
          setSavedPosts(prev => prev.filter(id => id !== postId));
        }
      }
    } catch (err) {
      
    }
  };

  return (
    <div className="posts-tab">
      {isCurrentUser && (
        <div className="mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-300 transition-colors"
          >
            Criar um novo post...
          </button>
          
          {showCreateModal && (
            <CreatePostModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onPostCreated={handlePostCreated}
            />
          )}
        </div>
      )}

      {loading && posts.length === 0 ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            {isCurrentUser 
              ? "Você ainda não criou nenhum post. Que tal começar agora?" 
              : "Este usuário ainda não criou nenhum post."}
          </p>
          {isCurrentUser && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90"
            >
              Criar primeiro post
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map(post => (
              <Post 
                key={post.id} 
                post={post}
                onReaction={(postId, reactionType) => handleReaction(postId, reactionType)}
                onJudgement={(postId, judgementType) => handleJudgement(postId, judgementType)}
                onReport={(postId, reason) => handleReport(postId, reason)}
                onToggleSave={(postId) => handleToggleSavePost(postId)}
                isSaved={savedPosts.includes(post.id)}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-6 text-center">
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

export default PostsTab; 