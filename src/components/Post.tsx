import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post as PostType, Comment as CommentType, judgementLabels } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  EmojiHappyIcon as EmojiHappyIcon,
  FireIcon,
  ChatIcon as ChatIcon,
  ShareIcon,
  CheckCircleIcon,
  BoltIcon as LightningBoltIcon,
  ExclamationIcon as ExclamationIcon,
  XIcon,
  UserIcon,
  ChatIcon,
  PaperAirplaneIcon,
  HandThumbUpIcon as ThumbUpIcon,
  HeartIcon,
} from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import BookmarkIcon from '@heroicons/react/outline/BookmarkIcon';
import DotsHorizontalIcon from '@heroicons/react/outline/DotsHorizontalIcon';
import PencilIcon from '@heroicons/react/outline/PencilIcon';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import PostReactions from './PostReactions';
import UserProfileLink from './UserProfileLink';
import { mockUsers } from '../services/mockData';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getApiUrl } from '../config';

interface PostProps {
  post: PostType;
  onReaction?: (postId: string, reactionType: 'quaseAcreditei' | 'hahaha' | 'mentiraEpica') => void;
  onJudgement?: (postId: string, judgementType: 'crivel' | 'inventiva' | 'totalmentePirada') => void;
  onReport?: (postId: string, reason: string) => void;
  isSaved?: boolean;
  onToggleSave?: (postId: string) => void;
  onEdit?: (post: PostType) => void;
  onDelete?: (postId: string) => void;
  navigate?: any;
}

const Post: React.FC<PostProps> = ({ 
  post, 
  onReaction, 
  onJudgement, 
  onReport, 
  isSaved, 
  onToggleSave, 
  onEdit, 
  onDelete, 
  navigate 
}) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showCommentsView, setShowCommentsView] = useState(false);
  const [activeJudgement, setActiveJudgement] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState(0);
  const [liked, setLiked] = useState(false);
  const [hearts, setHearts] = useState<number>(
    post.reactions && typeof post.reactions === 'object' && 'quaseAcreditei' in post.reactions ? 
      Number(post.reactions.quaseAcreditei || 0) : 0
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'anon';
  const optionsRef = useRef<HTMLDivElement>(null);
  const [postIsSaved, setPostIsSaved] = useState(isSaved || false);

  useEffect(() => {
    // Verificar se o usuário atual já curtiu o post
    if (post.userReactions && post.userReactions[userId]) {
      setLiked(true);
    }

    // Fechar menu de opções quando clicar fora dele
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [post.userReactions, userId]);

  useEffect(() => {
    if (post.commentCount && post.commentCount > 0) {
      setComments([]);
    }
  }, [post.id]);

  const handleLike = () => {
    // Atualizar estado local imediatamente para feedback visual
    const newLikedState = !liked;
    setLiked(newLikedState);
    
    // Atualizar contador localmente para feedback imediato
    const newHeartCount = newLikedState ? (hearts + 1) : Math.max(0, hearts - 1);
    setHearts(newHeartCount);
    
    // Se tiver handler de reação, usar ele
    if (onReaction) {
      onReaction(post.id, 'quaseAcreditei');
    } else {
      // Caso contrário, implementar localmente
      try {
        fetch(`${getApiUrl()}/api/posts/${post.id}/reactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            reactionType: 'quaseAcreditei',
            userId: userId
          })
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Falha ao registrar reação');
        })
        .then(data => {
          // Atualizar com o valor real do servidor
          setHearts(data.reactions.quaseAcreditei || 0);
        })
        .catch(error => {
          console.error('Erro ao reagir ao post:', error);
          // Reverter estado em caso de erro
          setLiked(!newLikedState);
          setHearts(hearts); // Reverter para o valor original
        });
      } catch (error) {
        console.error('Erro ao enviar reação:', error);
        setLiked(!newLikedState);
        setHearts(hearts); // Reverter para o valor original
      }
    }
  };

  const handleReport = (postId: string, reason: string) => {
    if (onReport) {
      onReport(postId, reason);
    } else {
      alert(`Post ${postId} reportado: ${reason}`);
    }
  };

  const handleEditPost = () => {
    setIsEditing(true);
    setShowOptionsMenu(false);
  };

  const handleSaveEdit = async () => {
    try {
      // Verificar se há conteúdo
      if (!editContent || editContent.trim() === '') {
        alert('O conteúdo do post não pode estar vazio.');
        return;
      }

      // Verificar se há token de autenticação
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('Você precisa estar logado para editar posts.');
        return;
      }

      // Mostrar feedback de carregamento
      const originalContent = post.content;
      
      const response = await fetch(`${getApiUrl()}/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: editContent,
          imageURL: post.imageURL,
          tags: post.tags,
        })
      });
      
      if (response.ok) {
        try {
          const updatedPost = await response.json();
          setIsEditing(false);
          
          // Se tiver handler de edição, chamar
          if (onEdit) {
            onEdit(updatedPost);
          } else {
            // Atualizar localmente
            post.content = editContent;
          }
        } catch (parseError) {
          console.error('Erro ao processar resposta JSON:', parseError);
          // Aplicar mudança localmente mesmo se houver erro de parsing
          post.content = editContent;
          setIsEditing(false);
        }
      } else {
        // Tentar obter mensagem de erro da API
        try {
          const errorData = await response.json();
          alert(`Falha ao salvar edição: ${errorData.error || errorData.message || 'Tente novamente.'}`);
        } catch (e) {
          // Se não conseguir obter o erro como JSON, mostrar mensagem genérica
          alert(`Falha ao salvar edição: ${response.status} ${response.statusText}`);
        }
        // Manter modo de edição ativo para que o usuário possa corrigir
      }
    } catch (error) {
      console.error('Erro ao editar post:', error);
      alert('Erro ao editar post. Verifique sua conexão e tente novamente.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
  };

  const handleDeletePost = async () => {
    if (window.confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
      try {
        const response = await fetch(`${getApiUrl()}/api/posts/${post.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        
        if (response.ok) {
          // Se tiver handler de exclusão, chamar
          if (onDelete) {
            onDelete(post.id);
          } else {
            // Feedback visual
            alert('Post excluído com sucesso!');
          }
        } else {
          alert('Falha ao excluir post. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao excluir post:', error);
        alert('Erro ao excluir post. Tente novamente.');
      }
    }
    setShowOptionsMenu(false);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment: CommentType = {
        id: `comment-${Date.now()}`,
        postId: post.id,
        userId: 'user123',
        content: comment,
        createdAt: new Date().toISOString()
      };
      
      setComments([...comments, newComment]);
      setComment('');
      setShowCommentModal(false);
      setShowCommentsView(true);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('Link copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar o link: ', err);
    });
  };

  const handleJudgement = (postId: string, judgementType: 'crivel' | 'inventiva' | 'totalmentePirada') => {
    setActiveJudgement(judgementType);
    onJudgement && onJudgement(postId, judgementType);
  };

  const toggleShowComments = () => {
    // Se o modal de comentários estiver fechado, abrir
    if (!showCommentModal) {
      setShowCommentModal(true);
    } else {
      // Se o modal estiver aberto, fechá-lo
      setShowCommentModal(false);
    }
  };

  // Função separada para visualizar comentários existentes
  const toggleCommentsView = () => {
    setShowCommentsView(!showCommentsView);
  };

  const getUsernameFromPost = () => {
    if (post.user?.username) {
      return post.user.username;
    }
    
    try {
      const userFromId = mockUsers.find(u => u.id === post.userId);
      if (userFromId?.username) {
        if (!post.user) {
          post.user = userFromId;
        }
        return userFromId.username;
      }
    } catch (error) {
      console.error("Erro ao buscar username:", error);
    }
    
    return post.userId || 'usuario';
  };

  const getUserPhoto = () => {
    if (post.user?.photoURL) {
      return post.user.photoURL;
    }
    
    try {
      const userFromId = mockUsers.find(u => u.id === post.userId);
      if (userFromId?.photoURL) {
        return userFromId.photoURL;
      }
    } catch (error) {
      console.error("Erro ao buscar foto do usuário:", error);
    }
    
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
  };

  const getUserDisplayName = () => {
    if (post.user?.displayName) {
      return post.user.displayName;
    }
    
    try {
      const userFromId = mockUsers.find(u => u.id === post.userId);
      if (userFromId?.displayName) {
        return userFromId.displayName;
      }
    } catch (error) {
      console.error("Erro ao buscar nome do usuário:", error);
    }
    
    return "Usuário Mentiroso";
  };

  const username = getUsernameFromPost();
  const userPhoto = getUserPhoto();
  const userDisplayName = getUserDisplayName();

  const getTopJudgement = () => {
    if (activeJudgement) return activeJudgement;
    if (post.judgements) {
      const entries = Object.entries(post.judgements) as [
        'crivel' | 'inventiva' | 'totalmentePirada',
        number
      ][];
      const sorted = entries.sort((a, b) => b[1] - a[1]);
      return sorted[0][0];
    }
    return null;
  };

  const topJudgement = getTopJudgement();

  const handleReactionCountChange = (count: number) => {
    setReactionCounts(count);
    console.log(`Total de reações: ${count}`);
  };

  const navigateToUserProfile = (userId: string) => {
    if (navigate) {
    navigate(`/user/${userId}`);
    }
  };

  const handleSavePost = async () => {
    // Atualizar o estado visual imediatamente para feedback
    const newSavedState = !postIsSaved;
    setPostIsSaved(newSavedState);
    
    // Se tiver handler externo, usar ele
    if (onToggleSave) {
      onToggleSave(post.id);
      return;
    }
    
    // Implementação local
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('Você precisa estar logado para salvar posts.');
        setPostIsSaved(!newSavedState); // Reverter estado
        return;
      }
      
      const response = await fetch(`${getApiUrl()}/api/posts/${post.id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ saved: newSavedState })
      });
      
      if (!response.ok) {
        // Se falhar, reverter o estado visual
        setPostIsSaved(!newSavedState);
        console.error('Erro ao salvar post:', await response.text());
        alert('Não foi possível salvar o post. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao processar salvamento:', error);
      setPostIsSaved(!newSavedState); // Reverter estado em caso de erro
      alert('Erro ao salvar o post. Verifique sua conexão.');
    }
  };

  return (
    <article className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4 
                        ${showCommentsView ? 'comment-open pb-0' : 'pb-2'}`}>
      <div className="flex items-center p-4">
        <div className="flex items-center">
          <UserProfileLink userId={post.userId || ''} className="mr-3">
            <img 
              src={userPhoto} 
              alt={userDisplayName} 
              className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
            />
          </UserProfileLink>
          <div>
            <UserProfileLink userId={post.userId || ''} className="hover:underline">
              <h3 className="font-semibold text-dark dark:text-white">
                {userDisplayName}
              </h3>
            </UserProfileLink>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt || new Date()).toLocaleDateString()} · 
              {post.isGenerated && <span className="ml-1 text-secondary font-medium">Gerado por IA</span>}
            </p>
          </div>
        </div>
        
        {/* Conteúdo do post ou interface de edição */}
        {currentUser && currentUser.id === post.userId && (
          <div className="ml-auto relative">
            <button 
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <DotsHorizontalIcon className="h-6 w-6" />
            </button>
            
            {showOptionsMenu && (
              <div 
                ref={optionsRef}
                className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10"
              >
                <button
                  onClick={handleEditPost}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Editar post
                </button>
                <button
                  onClick={handleDeletePost}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Excluir post
                </button>
              </div>
            )}
          </div>
        )}
        
        {topJudgement === 'crivel' && (
          <div className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            {judgementLabels.crivel}
          </div>
        )}
        {topJudgement === 'inventiva' && (
          <div className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
            <LightningBoltIcon className="h-4 w-4 mr-1" />
            {judgementLabels.inventiva}
          </div>
        )}
        {topJudgement === 'totalmentePirada' && (
          <div className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
            <ExclamationIcon className="h-4 w-4 mr-1" />
            {judgementLabels.totalmentePirada}
          </div>
        )}
      </div>
      
      {/* Conteúdo do post */}
      <div className="px-4 mb-4">
        {isEditing ? (
          <div className="w-full">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows={4}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
        )}
      </div>
      
      {post.imageURL && (
        <div className="mb-4 px-4">
          <img 
            src={post.imageURL} 
            alt={`Imagem do post de ${post.user?.displayName || 'usuário'}`} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap mb-4 px-4">
          {post.tags.map((tag, index) => (
            <Link
              key={index}
              to={`/tag/${tag}`}
              className="mr-2 mb-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* Contadores de reação */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 py-1 px-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {liked ? (
              <HeartIconSolid className="h-4 w-4 text-red-500 mr-1" />
            ) : (
              <HeartIcon className="h-4 w-4 mr-1" />
            )}
            <span>{hearts || 0} reações</span>
          </div>
          <div>
            <ChatIcon className="h-4 w-4 inline mr-1" />
            <button
              onClick={toggleCommentsView}
              className="hover:underline"
            >
              <span>{post.commentCount || comments.length || 0} comentários</span>
            </button>
          </div>
        </div>
        <div>
          <button
            onClick={() => handleJudgement(post.id, 'crivel')}
            className={`text-xs ${
              activeJudgement === 'crivel' ? 'text-blue-500 font-semibold' : ''
            }`}
          >
            {judgementLabels.crivel}
          </button>
          <span className="mx-1">•</span>
          <button
            onClick={() => handleJudgement(post.id, 'inventiva')}
            className={`text-xs ${
              activeJudgement === 'inventiva' ? 'text-purple-500 font-semibold' : ''
            }`}
          >
            {judgementLabels.inventiva}
          </button>
          <span className="mx-1">•</span>
          <button
            onClick={() => handleJudgement(post.id, 'totalmentePirada')}
            className={`text-xs ${
              activeJudgement === 'totalmentePirada' ? 'text-red-500 font-semibold' : ''
            }`}
          >
            {judgementLabels.totalmentePirada}
          </button>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div className="flex items-center justify-between py-2 px-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center px-3 py-1 rounded-md transition ${
            liked
              ? 'text-red-500 bg-red-50 dark:bg-red-900/10'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {liked ? (
            <HeartIconSolid className="h-5 w-5 mr-1" />
          ) : (
            <HeartIcon className="h-5 w-5 mr-1" />
          )}
          <span className="hidden sm:inline">{liked ? 'Curtido' : 'Curtir'}</span>
        </button>
        
        <button
          onClick={() => setShowCommentModal(true)}
          className="flex items-center justify-center px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-md"
        >
          <ChatIcon className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Comentar</span>
        </button>
        
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center justify-center px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-md"
        >
          <ShareIcon className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Compartilhar</span>
        </button>
        
        <button
          onClick={handleSavePost}
          className={`flex items-center justify-center px-3 py-1 rounded-md transition ${
            postIsSaved
              ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/10'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <BookmarkIcon className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">{postIsSaved ? 'Salvo' : 'Salvar'}</span>
        </button>
        
        <button
          onClick={() => setShowReportMenu(true)}
          className="flex items-center justify-center px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-md"
        >
          <ExclamationIcon className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Denunciar</span>
        </button>
      </div>

      {/* Seção de comentários */}
      {showCommentsView && comments.length > 0 && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Comentários</h4>
          {comments.map((comment) => {
            const commentUsername = comment.user?.username || comment.userId || 'usuario';
            const commentDisplayName = comment.user?.displayName || "Usuário Comentarista";
            const commentPhotoURL = comment.user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
            
            return (
              <div key={comment.id} className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
                <div className="flex items-center mb-1">
                  <Link to={`/profile/${commentUsername}`} className="flex items-center">
                    <img 
                      src={commentPhotoURL} 
                      alt={commentDisplayName} 
                      className="w-6 h-6 rounded-full mr-2 cursor-pointer hover:opacity-80 transition"
                    />
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      {commentDisplayName}
                    </span>
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 ml-8">{comment.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Comentários */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Adicionar Comentário</h3>
              <button 
                onClick={() => setShowCommentModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <textarea
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mb-4 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Digite seu comentário..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setShowCommentModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                onClick={handleAddComment}
                disabled={!comment.trim()}
              >
                Comentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Compartilhar</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                onClick={handleShare}
              >
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">WhatsApp</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                onClick={handleShare}
              >
                <div className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Twitter</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                onClick={handleShare}
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Facebook</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors"
                onClick={handleShare}
              >
                <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Instagram</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                onClick={handleShare}
              >
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Telegram</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(`https://mentei.app/post/${post.id}`);
                  alert('Link copiado para a área de transferência!');
                  setShowShareModal(false);
                }}
              >
                <div className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Copiar Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Denúncia */}
      {showReportMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Denunciar Mentira</h3>
              <button 
                onClick={() => setShowReportMenu(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Fechar modal"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Por que você está denunciando esta mentira?</p>
            <div className="space-y-3 mb-6">
              {['Mentira perigosa', 'Zoou demais', 'Fake news séria', 'Conteúdo ofensivo', 'Quebra as regras da comunidade'].map((reason, idx) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    value={reason}
                    checked={comment === reason}
                    onChange={() => setComment(reason)}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-200">{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setShowReportMenu(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-opacity-90"
                onClick={() => {
                  handleReport(post.id, comment);
                  setShowReportMenu(false);
                  setComment('');
                }}
                disabled={!comment}
              >
                Denunciar
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default Post; 