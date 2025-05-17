import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { HandThumbUpIcon, EmojiHappyIcon } from '@heroicons/react/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid, 
         EmojiHappyIcon as EmojiHappyIconSolid } from '@heroicons/react/solid';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ReactionType } from '../types';

interface PostReactionsProps {
  postId: string;
  initialReactions?: { [key: string]: number };
  userReaction?: string | null;
  onReactionChange?: (newReaction: string | null) => void;
  className?: string;
}

const PostReactions: React.FC<PostReactionsProps> = ({
  postId,
  initialReactions = {},
  userReaction: initialUserReaction = null,
  onReactionChange,
  className = ''
}) => {
  const [reactions, setReactions] = useState<{ [key: string]: number }>(initialReactions);
  const [userReaction, setUserReaction] = useState<string | null>(initialUserReaction);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  // Buscar reações quando o componente for montado
  useEffect(() => {
    if (!postId) return;
    
    const fetchReactions = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}/reactions`);
        setReactions(response.data.reactions || {});
      } catch (error) {
        console.error('Erro ao buscar reações:', error);
      }
    };
    
    fetchReactions();
  }, [postId]);
  
  // Buscar a reação do usuário quando o componente for montado
  useEffect(() => {
    if (!postId || !user?.id || !token) return;
    
    const fetchUserReaction = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}/reactions/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserReaction(response.data.reactionType || null);
      } catch (error) {
        console.error('Erro ao buscar reação do usuário:', error);
      }
    };
    
    fetchUserReaction();
  }, [postId, user?.id, token]);
  
  const handleReaction = async (reactionType: string) => {
    if (!token || !user?.id || loading) return;
    
    setLoading(true);
    
    try {
      const newReaction = userReaction === reactionType ? null : reactionType;
      
      const response = await axios.post(
        `/api/posts/${postId}/reactions`,
        { reactionType: newReaction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReactions(response.data.reactions || {});
      setUserReaction(newReaction);
      
      if (onReactionChange) {
        onReactionChange(newReaction);
      }
    } catch (error) {
      console.error('Erro ao adicionar reação:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const isActive = (type: string) => userReaction === type;
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => handleReaction(ReactionType.QuaseAcreditei)}
        disabled={loading}
        className={`flex items-center p-1 rounded-full transition-colors ${
          isActive(ReactionType.QuaseAcreditei) 
            ? 'text-red-500' 
            : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
        }`}
        aria-label="Quase Acreditei"
      >
        {isActive(ReactionType.QuaseAcreditei) ? (
          <HeartIconSolid className="h-6 w-6" />
        ) : (
          <HeartIcon className="h-6 w-6" />
        )}
        <span className="ml-1 text-sm">{reactions[ReactionType.QuaseAcreditei] || 0}</span>
      </button>
      
      <button
        onClick={() => handleReaction(ReactionType.Hahaha)}
        disabled={loading}
        className={`flex items-center p-1 rounded-full transition-colors ${
          isActive(ReactionType.Hahaha) 
            ? 'text-blue-500' 
            : 'text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400'
        }`}
        aria-label="Hahaha"
      >
        {isActive(ReactionType.Hahaha) ? (
          <EmojiHappyIconSolid className="h-6 w-6" />
        ) : (
          <EmojiHappyIcon className="h-6 w-6" />
        )}
        <span className="ml-1 text-sm">{reactions[ReactionType.Hahaha] || 0}</span>
      </button>
      
      <button
        onClick={() => handleReaction(ReactionType.MentiraEpica)}
        disabled={loading}
        className={`flex items-center p-1 rounded-full transition-colors ${
          isActive(ReactionType.MentiraEpica) 
            ? 'text-orange-500' 
            : 'text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400'
        }`}
        aria-label="Mentira Épica"
      >
        {isActive(ReactionType.MentiraEpica) ? (
          <HandThumbUpIconSolid className="h-6 w-6" />
        ) : (
          <HandThumbUpIcon className="h-6 w-6" />
        )}
        <span className="ml-1 text-sm">{reactions[ReactionType.MentiraEpica] || 0}</span>
      </button>
    </div>
  );
};

export default PostReactions;