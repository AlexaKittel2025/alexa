'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import UserCard from './UserCard';

interface UserLike {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing?: boolean;
}

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  likes: UserLike[];
  onFollow?: (userId: string) => void;
}

export default function LikesModal({
  isOpen,
  onClose,
  likes,
  onFollow
}: LikesModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Curtidas</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Likes List */}
        <div className="flex-1 overflow-y-auto p-4">
          {likes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma curtida ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {likes.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <Link href={`/perfil/${user.id}`} className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={user.avatar || '/images/avatar-placeholder.jpg'}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.name}</p>
                    </div>
                  </Link>
                  
                  {user.id !== 'current-user' && (
                    <button
                      onClick={() => onFollow && onFollow(user.id)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
                        user.isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {user.isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}