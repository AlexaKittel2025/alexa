import React, { useState } from 'react';
import Link from 'next/link';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email?: string;
    photoUrl?: string;
    avatar?: string;
    level: number;
    score: number;
    bio?: string;
    isOnline?: boolean;
  };
  compact?: boolean;
  showFollowButton?: boolean;
  onFollow?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, compact = false, showFollowButton = true, onFollow }) => {
  const { id, name, photoUrl, avatar, level, score, bio, isOnline = true } = user;
  const [isFollowing, setIsFollowing] = useState(false);
  
  const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(name);
  const avatarUrl = avatar || photoUrl || defaultAvatar;
  
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) {
      onFollow(id);
    }
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 transition-colors">
        <Link href={`/profile/${id}`} className="flex items-center gap-2 flex-1">
          <div className="relative">
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultAvatar;
              }}
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm">{name}</h3>
            <p className="text-xs text-purple-700">Nível {level}</p>
          </div>
        </Link>
        {showFollowButton && (
          <button
            onClick={handleFollowClick}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              isFollowing 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={avatarUrl} 
            alt={name} 
            width={64} 
            height={64} 
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultAvatar;
            }}
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold dark:text-white">{name}</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-medium">
                Nível {level}
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs font-medium">
                {score} pts
              </span>
            </div>
          </div>
          
          {bio && <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{bio}</p>}
          
          <div className="mt-3 flex items-center gap-3">
            <Link 
              href="/meu-perfil" 
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
            >
              Ver perfil completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard; 