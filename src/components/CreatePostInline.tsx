'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { FaSmile, FaHashtag, FaImage } from 'react-icons/fa';
import { createPost } from '@/services/postService';

interface CreatePostInlineProps {
  onPostCreated?: () => void;
  className?: string;
}

const CreatePostInline: React.FC<CreatePostInlineProps> = ({ onPostCreated, className = '' }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [showFullForm, setShowFullForm] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setShowFullForm(true);
  };

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    setIsPosting(true);
    try {
      const newPost = await createPost({
        userId: user.id,
        content: content.trim(),
        tags: []
      });

      setContent('');
      setShowFullForm(false);
      onPostCreated?.();
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar postagem. Tente novamente.');
    } finally {
      setIsPosting(false);
    }
  };

  if (!showFullForm) {
    return (
      <div className={`mb-6 ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div 
            onClick={handleInputClick}
            className="flex items-center gap-3 cursor-pointer"
          >
            {user && (
              <img
                src={user.photo_url || user.image || user.avatar || '/images/avatar-placeholder.jpg'}
                alt={user.username || user.display_name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-gray-500 dark:text-gray-400">
              Compartilhe uma mentira criativa...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-6 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex gap-3">
          {user && (
            <img
              src={user.photo_url || user.image || user.avatar || '/images/avatar-placeholder.jpg'}
              alt={user.username || user.display_name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe uma mentira criativa..."
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              maxLength={280}
              autoFocus
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-primary transition-colors">
                  <FaImage size={20} />
                </button>
                <button className="text-gray-500 hover:text-primary transition-colors">
                  <FaSmile size={20} />
                </button>
                <button className="text-gray-500 hover:text-primary transition-colors">
                  <FaHashtag size={20} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {280 - content.length}
                </span>
                <button
                  onClick={() => setShowFullForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isPosting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPosting ? 'Postando...' : 'Postar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostInline;