'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaHeart, FaComment, FaShare, FaBookmark, FaPaperPlane } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getUserProfileLink } from '@/utils/userUtils';
import Link from 'next/link';
import { savePostData, loadPostData, saveLike, saveComments, saveSavedPost } from '@/utils/persistenceUtils';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    content: string;
    image: string;
    likes: number;
    comments: number;
    createdAt: Date;
    user: {
      name: string;
      username: string;
      avatar: string;
    };
  };
}

interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: Date;
}

export default function PostModal({ isOpen, onClose, post }: PostModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    if (isOpen && post) {
      const savedData = loadPostData(post.id);
      
      if (savedData) {
        setIsLiked(savedData.isLiked || false);
        setLikes(savedData.likeCount || post.likes);
        setIsSaved(savedData.isSaved || false);
        
        // Converter strings de data de volta para objetos Date
        const commentsWithDates = savedData.comments?.map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        })) || [];
        
        setComments(commentsWithDates.length > 0 ? commentsWithDates : [
          { id: '1', username: 'usuario1', text: 'Que mentira incrível! 😂', createdAt: new Date() },
          { id: '2', username: 'usuario2', text: 'Não acredito nisso hahaha', createdAt: new Date() }
        ]);
      } else {
        // Se não há dados salvos, usar valores padrão
        setComments([
          { id: '1', username: 'usuario1', text: 'Que mentira incrível! 😂', createdAt: new Date() },
          { id: '2', username: 'usuario2', text: 'Não acredito nisso hahaha', createdAt: new Date() }
        ]);
      }
    }
  }, [isOpen, post]);

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

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    
    setIsLiked(newIsLiked);
    setLikes(newLikes);
    
    // Salvar no localStorage
    saveLike(post.id, newIsLiked, newLikes);
  };

  const handleSave = () => {
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    
    // Salvar no localStorage usando a nova função
    saveSavedPost(post.id, newIsSaved);
    
    // Mostrar notificação de salvo
    if (newIsSaved) {
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 2000);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Pegar username do localStorage
      const currentUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const username = currentUser.username || 'usuario_atual';
      
      const newComment: Comment = {
        id: Date.now().toString(),
        username: username,
        text: comment,
        createdAt: new Date()
      };
      
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment('');
      
      // Salvar comentários no localStorage
      const commentsToSave = updatedComments.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString()
      }));
      saveComments(post.id, commentsToSave);
    }
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/post/${post.id}`;
    const text = `Confira esta mentira incrível: ${post.content}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // Mostrar toast de confirmação
        alert('Link copiado!');
        break;
    }
    setShowShareOptions(false);
  };

  const addEmoji = (emoji: string) => {
    setComment(comment + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <img 
            src={post.image} 
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Detalhes */}
        <div className="w-full md:w-[400px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <Link 
              href={getUserProfileLink(post.user.username)}
              className="flex items-center gap-3"
              onClick={onClose}
            >
              <img 
                src={post.user.avatar}
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {post.user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{post.user.username}
                </p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Conteúdo e Comentários */}
          <div className="flex-1 overflow-y-auto">
            {/* Post content */}
            <div className="p-4 border-b dark:border-gray-700">
              {post.content && (
                <p className="text-gray-900 dark:text-white mb-4">
                  {post.content}
                </p>
              )}
              
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(post.createdAt, {
                  addSuffix: true,
                  locale: ptBR
                })}
              </time>
            </div>

            {/* Comentários */}
            <div className="p-4" id="comments-section">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Comentários
              </h3>
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <Link 
                          href={getUserProfileLink(comment.username)}
                          className="font-semibold text-gray-900 dark:text-white hover:underline"
                          onClick={onClose}
                        >
                          {comment.username}
                        </Link>
                        <span className="text-gray-700 dark:text-gray-300 ml-2">
                          {comment.text}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(comment.createdAt, {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="border-t dark:border-gray-700">
            <div className="flex justify-between p-4">
              <div className="flex gap-4">
                <button 
                  onClick={handleLike}
                  className="group transition-transform active:scale-110"
                >
                  <FaHeart 
                    className={`w-6 h-6 transition-colors ${
                      isLiked 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  />
                </button>
                
                <button 
                  className="group transition-transform active:scale-110"
                  onClick={() => {
                    const commentsSection = document.getElementById('comments-section');
                    commentsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <FaComment className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" />
                </button>
                
                <div className="relative">
                  <button 
                    className="group transition-transform active:scale-110"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <FaShare className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" />
                  </button>
                  
                  {/* Menu de compartilhamento */}
                  {showShareOptions && (
                    <div className="absolute bottom-10 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-[150px] z-10">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm"
                      >
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm"
                      >
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm"
                      >
                        WhatsApp
                      </button>
                      <div className="border-t dark:border-gray-700 my-1"></div>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm"
                      >
                        Copiar link
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={handleSave}
                className="group transition-transform active:scale-110"
              >
                <FaBookmark 
                  className={`w-6 h-6 transition-colors ${
                    isSaved 
                      ? 'text-gray-900 dark:text-white fill-current' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                />
              </button>
            </div>

            {/* Contador de likes */}
            <div className="px-4 pb-2">
              <p className="font-semibold text-gray-900 dark:text-white">
                {likes.toLocaleString()} curtidas
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {comments.length} comentários
              </p>
            </div>

            {/* Formulário de comentário */}
            <form onSubmit={handleComment} className="border-t dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                {/* Botão de Emoji */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <span className="text-xl">😊</span>
                  </button>
                  
                  {/* Picker de Emojis */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-10 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 grid grid-cols-6 gap-2 z-10">
                      {['😀', '😂', '😍', '🤔', '😱', '👍', '❤️', '🔥', '🎉', '😎', '🤯', '🙌'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => addEmoji(emoji)}
                          className="text-xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                
                {/* Botão de Enviar */}
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className={`p-1.5 rounded-full transition-all ${
                    comment.trim() 
                      ? 'text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaPaperPlane className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Notificação de Salvamento */}
      {showSaveNotification && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm">Post salvo com sucesso!</p>
        </div>
      )}
    </div>
  );
}