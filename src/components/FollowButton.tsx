import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface FollowButtonProps {
  userId: string;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, className = '', onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Verificar se o usuário atual já segue o usuário alvo
    const checkFollowStatus = async () => {
      if (!isAuthenticated || !currentUser) return;
      
      try {
        setLoading(true);
        
        const response = await axios.get(`/api/users/${currentUser.id}/following/${userId}`);
        setIsFollowing(response.data.isFollowing);
        
        if (onFollowChange) {
          onFollowChange(response.data.isFollowing);
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };
    
    checkFollowStatus();
  }, [userId, currentUser, isAuthenticated, onFollowChange]);
  
  const toggleFollow = async () => {
    if (!isAuthenticated || !currentUser) {
      // Redirecionar para login ou mostrar mensagem
      alert('Você precisa estar logado para seguir outros usuários.');
      return;
    }
    
    if (userId === currentUser.id) {
      alert('Você não pode seguir a si mesmo.');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      const endpoint = isFollowing 
        ? `/api/users/${currentUser.id}/unfollow/${userId}`
        : `/api/users/${currentUser.id}/follow/${userId}`;
      
      const response = await axios.post(endpoint, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setIsFollowing(!isFollowing);
      
      if (onFollowChange) {
        onFollowChange(!isFollowing);
      }
    } catch (error) {
      
      alert('Não foi possível alterar o status de seguir. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500'
          : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:ring-blue-500'
      } ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Aguarde...
        </span>
      ) : isFollowing ? (
        'Seguindo'
      ) : (
        'Seguir'
      )}
    </button>
  );
};

export default FollowButton;