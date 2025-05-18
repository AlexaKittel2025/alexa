'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCheck, FaUserPlus, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: string;
  username?: string;
  initialIsFollowing?: boolean;
  className?: string;
  onFollowChange?: (isFollowing: boolean, counts: { followersCount: number; followingCount: number }) => void;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
  userId, 
  username,
  initialIsFollowing = false,
  className = '', 
  onFollowChange,
  size = 'md',
  showIcon = true
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    checkFollowStatus();
  }, [userId, user]);
  
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);
  
  const checkFollowStatus = async () => {
    if (!user || user.id === userId) return;
    
    try {
      const response = await fetch(`/api/users/${userId}/follow`);
      const data = await response.json();
      
      if (data && typeof data.isFollowing === 'boolean') {
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Erro ao verificar status de follow:', error);
    }
  };
  
  const toggleFollow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (userId === user.id) {
      return;
    }
    
    setLoading(true);
    
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch(`/api/users/${userId}/follow`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao alterar follow');
      }
      
      const data = await response.json();
      const newFollowingState = !isFollowing;
      
      setIsFollowing(newFollowingState);
      
      if (onFollowChange) {
        onFollowChange(newFollowingState, {
          followersCount: data.followersCount,
          followingCount: data.followingCount
        });
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
      alert('Não foi possível completar a ação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  if (user && userId === user.id) {
    return null;
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const getButtonText = () => {
    if (loading) return null;
    if (isFollowing && isHovering) return 'Deixar de seguir';
    if (isFollowing) return 'Seguindo';
    return 'Seguir';
  };
  
  const getButtonIcon = () => {
    if (loading) return <FaSpinner className="animate-spin" />;
    if (isFollowing) return <FaUserCheck />;
    return <FaUserPlus />;
  };
  
  const buttonClasses = `
    ${sizeClasses[size]}
    rounded-full font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    flex items-center justify-center gap-2
    ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
    ${isFollowing 
      ? isHovering
        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      : 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600'
    }
    ${className}
  `;
  
  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={buttonClasses}
      title={isFollowing ? `Deixar de seguir @${username || userId}` : `Seguir @${username || userId}`}
    >
      {showIcon && getButtonIcon()}
      {getButtonText()}
    </button>
  );
};

export default FollowButton;