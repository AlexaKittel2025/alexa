import React from 'react';
import Link from 'next/link';
import { getUserProfileLink } from '@/utils/userUtils';

interface SuggestionCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
    isFollowing: boolean;
    level?: number;
    points?: number;
  };
  onFollow: () => void;
}

export default function SuggestionCard({ user, onFollow }: SuggestionCardProps) {
  const { id, name, username, avatar, bio, isFollowing, level, points } = user;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 w-full">
      {/* Card com altura fixa em desktop e automática em mobile */}
      <div className="p-7 flex flex-col">
        {/* Header com avatar e informações */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar com tamanho fixo e sempre circular */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 p-0.5">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                <img 
                  src={avatar} 
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Informações do usuário */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">
              {name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">
              @{username}
            </p>
            {/* Badges de nível e pontos */}
            {(level || points) && (
              <div className="flex gap-2 mt-2">
                {level && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Nível {level}
                  </span>
                )}
                {points && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {points.toLocaleString()} pts
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Bio com altura fixa e ellipsis */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6">
          {bio}
        </p>
        
        {/* Botões alinhados no final */}
        <div className="flex items-center justify-between gap-2">
          <Link 
            href={getUserProfileLink(username)}
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors whitespace-nowrap"
          >
            Ver perfil
          </Link>
          
          <button
            onClick={onFollow}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
              isFollowing 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' 
                : 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
            }`}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </button>
        </div>
      </div>
    </div>
  );
}