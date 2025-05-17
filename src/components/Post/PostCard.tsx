'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaThumbsUp, FaComment, FaShare, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { ExtendedPost } from '@/types/prisma';

interface PostCardProps {
  post: ExtendedPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [showActions, setShowActions] = useState(false);

  const handleReportClick = () => {
    setShowActions(!showActions);
  };

  // Calcular tempo formatado
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Contagem de reações
  const reactionCount = post.reactions?.length || 0;
  const commentCount = post.comments?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Image
            src={post.author?.image || 'https://via.placeholder.com/40'}
            alt={post.author?.name || 'Usuário'}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <Link href={`/perfil/${post.authorId}`} className="font-semibold hover:underline">
              {post.author?.name || 'Usuário anônimo'}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleReportClick}
          aria-label="Denunciar"
        >
          <FaExclamationTriangle />
        </button>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
        
        {post.imageUrl && (
          <div className="mt-3">
            <Image 
              src={post.imageUrl} 
              alt={post.title} 
              width={600} 
              height={400} 
              className="rounded-lg max-h-96 object-cover w-full"
            />
          </div>
        )}
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tagItem, index) => (
            <Link 
              href={`/tag/${tagItem.tag.name}`} 
              key={index} 
              className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"
            >
              #{tagItem.tag.name}
            </Link>
          ))}
        </div>
      )}
      
      <div className="flex justify-between border-t pt-3 dark:border-gray-700">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            <FaThumbsUp />
            <span>{reactionCount}</span>
          </button>
          <Link href={`/post/${post.id}`} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            <FaComment />
            <span>{commentCount}</span>
          </Link>
          <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            <FaShare />
            <span>Compartilhar</span>
          </button>
        </div>
        
        <div className="text-xs flex items-center text-gray-500 dark:text-gray-400">
          <FaClock className="mr-1" size={12} />
          <span>Visualizações: {post.views}</span>
        </div>
      </div>
      
      {showActions && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm mb-2">Denunciar este conteúdo?</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
              Denunciar
            </button>
            <button 
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-sm"
              onClick={() => setShowActions(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 