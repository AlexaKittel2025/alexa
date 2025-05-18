'use client';

import { useState, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { onReceiveComment } from '@/lib/gamification';

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  postId: string;
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
}

interface CommentSystemProps {
  postId: string;
  authorId: string;
  onClose?: () => void;
  onCommentsUpdate?: (count: number) => void;
  isModal?: boolean;
}

export default function CommentSystem({ postId, authorId, onClose, onCommentsUpdate, isModal = false }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useCurrentUser();

  useEffect(() => {
    loadComments();
  }, [postId]);

  // Listener para atualizar avatares quando o perfil do usuário mudar
  useEffect(() => {
    const handleProfileUpdate = () => {
      // Atualizar comentários com a nova imagem do usuário
      if (user) {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.userId === user.id 
              ? { ...comment, userAvatar: user.photoURL || user.avatar || user.avatarUrl || undefined }
              : comment
          )
        );
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [user]);

  const loadComments = () => {
    try {
      const savedComments = localStorage.getItem(`comments_${postId}`);
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments);
        setComments(parsedComments.sort((a: Comment, b: Comment) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim() || isLoading) return;

    setIsLoading(true);

    // Debug: verificar propriedades de imagem do usuário

    try {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment.trim(),
        userId: user.id,
        userName: user.displayName || user.name || 'Usuário',
        userAvatar: user.photoURL || user.avatar || user.avatarUrl || undefined,
        postId,
        createdAt: new Date().toISOString()
      };

      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      
      // Salvar no localStorage (simular API)
      localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
      
      setNewComment('');
      
      // Notificar o componente pai sobre a atualização
      if (onCommentsUpdate) {
        onCommentsUpdate(updatedComments.length);
      }
      
      // Gamificação - adicionar XP ao autor do post
      if (authorId !== user.id) {
        onReceiveComment(authorId);
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = () => {
    if (!editContent.trim() || !editingComment) return;

    const updatedComments = comments.map(comment => {
      if (comment.id === editingComment) {
        return {
          ...comment,
          content: editContent.trim(),
          updatedAt: new Date().toISOString(),
          isEdited: true
        };
      }
      return comment;
    });

    setComments(updatedComments);
    localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
    
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        locale: ptBR,
        addSuffix: true
      });
    } catch {
      return 'agora';
    }
  };

  const containerClass = isModal
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    : "bg-white rounded-lg shadow-md";

  const contentClass = isModal
    ? "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col"
    : "";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* Header */}
        {isModal && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Comentários</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        )}

        {/* Área de Comentários */}
        <div className={`${isModal ? 'flex-1 overflow-y-auto' : ''} p-4`}>
          {/* Formulário de novo comentário */}
          {user && (
            <div className="mb-6">
              <div className="w-full">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="w-full p-3 border dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isLoading}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      !newComment.trim() || isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <FaPaperPlane size={16} />
                    <span>Enviar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Comentários */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            ) : (
              comments.map((comment) => {
                // Usar a imagem atual do usuário se for o próprio usuário
                const avatarSrc = comment.userId === user?.id 
                  ? (user.photoURL || user.avatar || user.avatarUrl || '/images/avatar-placeholder.jpg')
                  : (comment.userAvatar || '/images/avatar-placeholder.jpg');
                
                return (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <img
                      src={avatarSrc}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      {editingComment === comment.id ? (
                        <div>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={3}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => {
                                setEditingComment(null);
                                setEditContent('');
                              }}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleUpdateComment}
                              className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                              Salvar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {comment.userName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(comment.createdAt)}
                              {comment.isEdited && ' (editado)'}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-200">{comment.content}</p>
                        </>
                      )}
                    </div>
                    
                    {/* Ações do comentário */}
                    {user && comment.userId === user.id && editingComment !== comment.id && (
                      <div className="flex space-x-3 mt-1">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                        >
                          <FaEdit size={12} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center space-x-1"
                        >
                          <FaTrash size={12} />
                          <span>Excluir</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}