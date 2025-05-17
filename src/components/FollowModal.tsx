'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { getUserProfileLink } from '@/utils/userUtils';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing?: boolean;
}

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: User[];
  emptyMessage?: string;
}

export default function FollowModal({ 
  isOpen, 
  onClose, 
  title, 
  users, 
  emptyMessage = 'Nenhum usuário encontrado' 
}: FollowModalProps) {
  const [usersState, setUsersState] = useState<User[]>(users);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setUsersState(users);
  }, [users]);

  // Prevenir scroll quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFollowToggle = (userId: string) => {
    setUsersState(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  const filteredUsers = usersState.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b dark:border-gray-700">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar usuários..."
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Lista de usuários */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <Link
                    href={getUserProfileLink(user.username)}
                    className="flex items-center gap-3"
                    onClick={onClose}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                  
                  <button
                    onClick={() => handleFollowToggle(user.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      user.isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {user.isFollowing ? 'Seguindo' : 'Seguir'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {emptyMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}