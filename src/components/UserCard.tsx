import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
    level: number;
    score: number;
    bio?: string;
    isOnline: boolean;
  };
  compact?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, compact = false }) => {
  const { id, name, photoUrl, level, score, bio, isOnline } = user;
  
  const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(name);
  const avatarUrl = photoUrl || defaultAvatar;
  
  if (compact) {
    return (
      <Link href={`/profile/${id}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 transition-colors">
        <div className="relative">
          <Image 
            src={avatarUrl} 
            alt={name} 
            width={40} 
            height={40} 
            className="rounded-full"
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
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image 
            src={avatarUrl} 
            alt={name} 
            width={64} 
            height={64} 
            className="rounded-full"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold">{name}</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                Nível {level}
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                {score} pts
              </span>
            </div>
          </div>
          
          {bio && <p className="text-gray-600 mt-1 text-sm">{bio}</p>}
          
          <div className="mt-3">
            <Link 
              href={`/profile/${id}`} 
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
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