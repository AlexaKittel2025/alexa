'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import FollowButton from './FollowButton';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';

interface User {
  id: string;
  displayName: string;
  username: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
  isPro?: boolean;
  level?: number;
}

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userId: string;
  type: 'followers' | 'following';
}

export default function FollowModal({ 
  isOpen, 
  onClose, 
  title, 
  userId,
  type
}: FollowModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, userId, type]);

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

  const loadUsers = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'followers' 
        ? `/api/users/${userId}/followers`
        : `/api/users/${userId}/following`;
        
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.success && Array.isArray(data[type])) {
        setUsers(data[type].map((user: any) => ({
          ...user,
          avatar: user.avatar || generateRealPersonAvatar(['men', 'women'][Math.random() < 0.5 ? 0 : 1])
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        {!loading && users.length > 0 && (
          <div className="p-4 border-b dark:border-gray-700">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuários..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        )}

        {/* Lista de usuários */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner className="animate-spin text-3xl text-purple-600" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <Link
                    href={`/perfil/${user.id}`}
                    className="flex items-center gap-3 flex-1"
                    onClick={onClose}
                  >
                    <img
                      src={user.avatar || generateRealPersonAvatar(['men', 'women'][Math.random() < 0.5 ? 0 : 1])}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.displayName}
                        </p>
                        {user.isPro && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                  
                  <FollowButton
                    userId={user.id}
                    username={user.username}
                    initialIsFollowing={user.isFollowing || false}
                    size="sm"
                    showIcon={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {searchQuery ? 'Nenhum usuário encontrado' : `Nenhum ${type === 'followers' ? 'seguidor' : 'seguindo'} ainda`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}