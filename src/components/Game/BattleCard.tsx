'use client';

import { useState } from 'react';
import { FaTrophy, FaCrown, FaFire, FaBolt, FaStar } from 'react-icons/fa';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  battleScore?: number;
  likes?: number;
  comments?: number;
}

interface BattleCardProps {
  post: Post;
  onVote: () => void;
  voted: boolean;
  winner: boolean;
  disabled: boolean;
  position: 'left' | 'right';
}

export default function BattleCard({ post, onVote, voted, winner, disabled, position }: BattleCardProps) {
  const [hovering, setHovering] = useState(false);

  const getCardClasses = () => {
    const baseClasses = "relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform h-full";
    
    if (winner) return `${baseClasses} bg-gradient-to-br from-green-500 to-emerald-600 scale-105 shadow-2xl text-white`;
    if (voted && !winner) return `${baseClasses} bg-gray-100 opacity-50`;
    if (hovering && !disabled) return `${baseClasses} bg-white shadow-xl scale-102 border-2 border-purple-400`;
    return `${baseClasses} bg-white shadow-lg border border-gray-200`;
  };

  return (
    <div
      className={getCardClasses()}
      onClick={() => !disabled && onVote()}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Indicador de posição */}
      <div className={`absolute -top-6 ${position === 'left' ? 'left-4' : 'right-4'} text-sm font-bold text-gray-500`}>
        {position === 'left' ? 'OPÇÃO 1' : 'OPÇÃO 2'}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
            {post.author?.image ? (
              <img 
                src={post.author.image} 
                alt={post.author.name || ''} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-purple-800 font-bold text-lg">
                {post.author?.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
          <div>
            <p className={`font-semibold ${winner ? 'text-white' : 'text-gray-800'}`}>
              {post.author?.name || 'Anônimo'}
            </p>
            {post.battleScore !== undefined && post.battleScore > 0 && (
              <p className={`text-xs flex items-center ${winner ? 'text-green-100' : 'text-gray-600'}`}>
                <FaCrown className="mr-1 text-yellow-500" size={10} /> 
                {post.battleScore} vitórias
              </p>
            )}
          </div>
        </div>
        
        {/* Ícone de status */}
        {winner && (
          <div className="animate-bounce">
            <FaTrophy className="text-yellow-300 text-2xl" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="mb-4">
        <p className={`text-lg leading-relaxed ${winner ? 'text-white' : 'text-gray-800'}`}>
          {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
        </p>
      </div>

      {/* Imagem se houver */}
      {post.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Footer com estatísticas */}
      <div className={`flex items-center justify-between text-sm ${winner ? 'text-green-100' : 'text-gray-600'}`}>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <FaFire className="mr-1" /> {post.likes || 0}
          </span>
          <span className="flex items-center">
            <FaBolt className="mr-1" /> {post.comments || 0}
          </span>
        </div>
        
        {!voted && !disabled && (
          <div className={`font-medium ${hovering ? 'text-purple-600' : 'text-gray-500'}`}>
            Clique para votar
          </div>
        )}
      </div>

      {/* Badge de vencedor */}
      {winner && (
        <div className="absolute -top-4 -right-4 bg-yellow-500 text-white p-3 rounded-full shadow-lg animate-pulse">
          <FaStar className="text-xl" />
        </div>
      )}

      {/* Efeito de hover */}
      {hovering && !disabled && !voted && (
        <div className="absolute inset-0 bg-purple-600 bg-opacity-5 rounded-2xl pointer-events-none" />
      )}
    </div>
  );
}