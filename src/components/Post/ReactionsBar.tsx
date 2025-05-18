'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaPaperPlane, FaBookmark, FaSurprise, FaLaugh, FaFire } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { onReceiveLike, onReceiveReaction } from '@/lib/gamification';
import { triggerGamificationEvent } from '@/components/GamificationNotification';

interface Reaction {
  id: string;
  type: 'like' | 'hahaha' | 'quaseAcreditei' | 'mentiraEpica';
  userId: string;
  postId: string;
  createdAt: string;
}

interface ReactionsBarProps {
  postId: string;
  authorId: string;
  initialReactions?: Reaction[];
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  onUpdate?: (reactions: any) => void;
  size?: 'small' | 'medium' | 'large';
}

const reactionTypes = {
  like: { icon: FaHeart, label: 'Curtir', color: 'text-red-500' },
  hahaha: { icon: FaLaugh, label: 'Hahaha', color: 'text-yellow-500' },
  quaseAcreditei: { icon: FaSurprise, label: 'Quase Acreditei', color: 'text-blue-500' },
  mentiraEpica: { icon: FaFire, label: 'Mentira Épica', color: 'text-orange-500' }
};

export default function ReactionsBar({ 
  postId, 
  authorId,
  initialReactions = [], 
  onComment, 
  onShare,
  onSave,
  isSaved,
  onUpdate,
  size = 'medium' 
}: ReactionsBarProps) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const { user } = useCurrentUser();
  
  const sizeClasses = {
    small: 'text-sm space-x-3',
    medium: 'text-base space-x-4',
    large: 'text-lg space-x-5'
  };
  
  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  useEffect(() => {
    if (user) {
      const userReactionTypes = reactions
        .filter(r => r.userId === user.id)
        .map(r => r.type);
      setUserReactions(new Set(userReactionTypes));
    }
  }, [user, reactions]);

  const handleReaction = async (type: keyof typeof reactionTypes) => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const hasReacted = userReactions.has(type);
      
      if (hasReacted) {
        // Remove reaction
        const updatedReactions = reactions.filter(
          r => !(r.userId === user.id && r.type === type)
        );
        setReactions(updatedReactions);
        setUserReactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(type);
          return newSet;
        });
        
        // Simular chamada API
        localStorage.setItem(`reactions_${postId}`, JSON.stringify(updatedReactions));
      } else {
        // Add reaction
        const newReaction: Reaction = {
          id: `${Date.now()}`,
          type,
          userId: user.id,
          postId,
          createdAt: new Date().toISOString()
        };
        
        const updatedReactions = [...reactions, newReaction];
        setReactions(updatedReactions);
        setUserReactions(prev => new Set([...prev, type]));
        
        // Simular chamada API
        localStorage.setItem(`reactions_${postId}`, JSON.stringify(updatedReactions));
        
        // Callback para atualizar o componente pai
        if (onUpdate) {
          const reactionCounts = Object.keys(reactionTypes).reduce((acc, key) => {
            acc[key] = updatedReactions.filter(r => r.type === key).length;
            return acc;
          }, {} as Record<string, number>);
          onUpdate(reactionCounts);
        }
        
        // Gamificação - só adiciona XP se o autor não for o usuário atual
        if (authorId !== user.id) {
          if (type === 'like') {
            onReceiveLike(authorId);
          } else {
            onReceiveReaction(authorId);
          }
        }
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false);
      setShowReactionPicker(false);
    }
  };

  const getReactionCount = (type: keyof typeof reactionTypes) => {
    return reactions.filter(r => r.type === type).length;
  };

  const getTotalReactions = () => {
    return reactions.length;
  };

  const likeCount = getReactionCount('like');
  const hasLiked = userReactions.has('like');

  return (
    <div className={`flex items-center justify-between ${sizeClasses[size]}`}>
      <div className="flex items-center space-x-4">
        {/* Botão de Like/Reação */}
        <div className="relative">
          <button
            onClick={() => handleReaction('like')}
            onMouseEnter={() => setShowReactionPicker(true)}
            onMouseLeave={() => setShowReactionPicker(false)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            {hasLiked ? (
              <FaHeart className="text-red-500" size={iconSizes[size]} />
            ) : (
              <FaRegHeart size={iconSizes[size]} />
            )}
            <span>{likeCount > 0 ? likeCount : 'Curtir'}</span>
          </button>
          
          {/* Picker de Reações */}
          {showReactionPicker && (
            <div 
              className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2 z-10"
              onMouseEnter={() => setShowReactionPicker(true)}
              onMouseLeave={() => setShowReactionPicker(false)}
            >
              {Object.entries(reactionTypes).map(([key, reaction]) => {
                const Icon = reaction.icon;
                const count = getReactionCount(key as keyof typeof reactionTypes);
                const hasReacted = userReactions.has(key);
                
                return (
                  <button
                    key={key}
                    onClick={() => handleReaction(key as keyof typeof reactionTypes)}
                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative ${
                      hasReacted ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    title={reaction.label}
                  >
                    <Icon 
                      className={hasReacted ? reaction.color : 'text-gray-600 dark:text-gray-400'}
                      size={iconSizes[size]} 
                    />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gray-800 dark:bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Botão de Comentário */}
        <button
          onClick={onComment}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <FaComment size={iconSizes[size]} />
          <span>Comentar</span>
        </button>
        
        {/* Botão de Compartilhar */}
        <button
          onClick={onShare}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <FaPaperPlane size={iconSizes[size]} className="-rotate-45" />
          <span>Compartilhar</span>
        </button>
      </div>
      
      {/* Botão de Salvar */}
      <button
        onClick={onSave}
        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <FaBookmark size={iconSizes[size]} className={isSaved ? 'text-gray-900 dark:text-white' : ''} />
      </button>
    </div>
  );
}