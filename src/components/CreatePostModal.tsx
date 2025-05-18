;

;
import { PaperAirplaneIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';
import React, { useState, useRef } from 'react';import { useAuth } from '../context/AuthContext';
import { Post } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !selectedImage) {
      setError('Adicione uma mensagem ou uma imagem');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Preparar dados do formulário
      const formData = new FormData();
      formData.append('content', content);
      formData.append('tags', JSON.stringify(tags));
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      // Enviar para a API
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Você precisa estar logado para criar um post');
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar post');
      }
      
      const data = await response.json();
      
      // Limpar formulário
      setContent('');
      setTags([]);
      setSelectedImage(null);
      setImagePreview(null);
      
      // Chamar callback com o novo post
      onPostCreated(data.post);
      
      // Fechar modal
      onClose();
    } catch (err) {
      
      setError(err instanceof Error ? err.message : 'Erro ao criar post');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Criar nova mentira
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {currentUser && (
            <div className="flex items-center mb-4">
              <img 
                src={currentUser.photoURL || "https://via.placeholder.com/40"} 
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {currentUser.displayName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{currentUser.username}
                </p>
              </div>
            </div>
          )}
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você quer inventar hoje?"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            rows={4}
          />
          
          {imagePreview && (
            <div className="mt-3 relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full rounded-lg max-h-60 object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          )}
          
          <div className="mt-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  #{tag}
                  <button 
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar tag (pressione Enter)"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-3 rounded-r-lg"
              >
                Adicionar
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-between mt-4 pt-3 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <PhotographIcon className="h-6 w-6 mr-1" />
              <span>Imagem</span>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`
                flex items-center px-4 py-2 rounded-full
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-opacity-90 text-white'
                }
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5 mr-1" />
                  <span>Publicar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal; 