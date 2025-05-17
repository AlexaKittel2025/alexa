'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaPaperPlane, FaBookmark } from 'react-icons/fa';
import { FaHeart as FaHeartSolid } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CommentsModal from '../CommentsModal';
import LikesModal from '../LikesModal';
import { getUserProfileLink } from '@/utils/userUtils';
import { savePostData, loadPostData, saveLike, saveComments, saveSavedPost, isPostSaved } from '@/utils/persistenceUtils';

interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: Date;
  isMyComment?: boolean;
}

interface UserLike {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing?: boolean;
}

interface InstagramPostProps {
  post: {
    id: string;
    user: {
      id: string;
      name: string;
      username: string;
      avatar: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    createdAt: Date;
    likedByMe?: boolean;
    saved?: boolean;
  };
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
}

export default function InstagramPost({ post, onLike, onSave, onShare, onComment }: InstagramPostProps) {
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved || false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [usersWhoLiked, setUsersWhoLiked] = useState<UserLike[]>([]);

  // Sync state with props
  useEffect(() => {
    setLiked(post.likedByMe || false);
    setLikes(post.likes);
    setSaved(post.saved || false);
  }, [post.likedByMe, post.likes, post.saved]);

  // Load saved comments from localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem(`post-${post.id}-comments`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
      setCommentCount(JSON.parse(savedComments).length);
    }
  }, [post.id]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`post-${post.id}-comments`, JSON.stringify(comments));
  }, [comments, post.id]);

  // Load saved likes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem(`post-${post.id}-likes`);
    if (savedLikes) {
      const parsed = JSON.parse(savedLikes);
      setUsersWhoLiked(parsed);
      setLikes(parsed.length);
    } else {
      // Mock initial likes if post has likes
      const mockLikes: UserLike[] = [
        {
          id: 'user-1',
          name: 'Ana Silva',
          username: 'anasilva',
          avatar: '/images/avatar-placeholder.jpg',
          isFollowing: true
        },
        {
          id: 'user-2',
          name: 'Carlos Santos',
          username: 'carlossantos',
          avatar: '/images/avatar-placeholder.jpg',
          isFollowing: false
        }
      ];
      if (post.likes > 0) {
        const initialLikes = mockLikes.slice(0, Math.min(post.likes, mockLikes.length));
        setUsersWhoLiked(initialLikes);
      } else {
        setUsersWhoLiked([]);
      }
    }
  }, [post.id]);

  // Save likes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`post-${post.id}-likes`, JSON.stringify(usersWhoLiked));
  }, [usersWhoLiked, post.id]);

  const handleLike = () => {
    const currentUser: UserLike = {
      id: 'current-user',
      name: 'Meu Nome',
      username: 'meuusuario',
      avatar: '/images/avatar-placeholder.jpg',
      isFollowing: false
    };

    if (liked) {
      setUsersWhoLiked(usersWhoLiked.filter(user => user.id !== 'current-user'));
      setLikes(likes - 1);
    } else {
      setUsersWhoLiked([currentUser, ...usersWhoLiked]);
      setLikes(likes + 1);
    }
    
    setLiked(!liked);
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) {
      onSave(post.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.id);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: 'current-user',
        username: 'meuusuario',
        userAvatar: '/images/avatar-placeholder.jpg',
        text: comment,
        createdAt: new Date(),
        isMyComment: true
      };
      
      setComments([...comments, newComment]);
      setCommentCount(commentCount + 1);
      setComment('');
      
      if (onComment) {
        onComment(post.id, comment);
      }
    }
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'meuusuario',
      userAvatar: '/images/avatar-placeholder.jpg',
      text: text,
      createdAt: new Date(),
      isMyComment: true
    };
    
    setComments([...comments, newComment]);
    setCommentCount(commentCount + 1);
    
    if (onComment) {
      onComment(post.id, text);
    }
  };

  const handleEditComment = (commentId: string, newText: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, text: newText } : comment
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    setCommentCount(commentCount - 1);
  };

  const handleFollowFromLikes = (userId: string) => {
    setUsersWhoLiked(usersWhoLiked.map(user =>
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  const contentPreview = post.content.length > 100 && !showFullContent
    ? post.content.slice(0, 100) + '...'
    : post.content;

  return (
    <>
      <article className="bg-white border border-gray-200 rounded-lg mb-6">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <Link href={getUserProfileLink(post.user.username)} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={post.user.avatar || '/images/avatar-placeholder.jpg'}
                alt={post.user.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-sm">{post.user.username}</span>
          </Link>
          
          <button className="p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Image */}
        {post.image && (
          <div className="relative aspect-square w-full">
            <Image
              src={post.image}
              alt="Post content"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className="transition-transform active:scale-110">
                {liked ? (
                  <FaHeartSolid className="w-6 h-6 text-red-500" />
                ) : (
                  <FaHeart className="w-6 h-6 text-gray-900 hover:text-gray-600" />
                )}
              </button>
              
              <button 
                onClick={() => setShowCommentsModal(true)}
                className="transition-transform active:scale-110"
              >
                <FaComment className="w-6 h-6 text-gray-900 hover:text-gray-600" />
              </button>
              
              <button onClick={handleShare} className="transition-transform active:scale-110">
                <FaPaperPlane className="w-6 h-6 text-gray-900 hover:text-gray-600 -rotate-45" />
              </button>
            </div>
            
            <button onClick={handleSave} className="transition-transform active:scale-110">
              {saved ? (
                <FaBookmark className="w-6 h-6 text-gray-900" />
              ) : (
                <FaBookmark className="w-6 h-6 text-gray-900 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Likes */}
          <div className="mb-2">
            <button 
              onClick={() => setShowLikesModal(true)}
              className="font-semibold text-sm hover:text-gray-600 transition-colors"
            >
              {likes.toLocaleString('pt-BR')} curtidas
            </button>
          </div>

          {/* Content */}
          <div className="mb-2">
            <Link href={`/perfil/${post.user.id}`} className="font-semibold text-sm mr-2">
              {post.user.username}
            </Link>
            <span className="text-sm">
              {contentPreview}
              {post.content.length > 100 && !showFullContent && (
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-gray-500 ml-1"
                >
                  mais
                </button>
              )}
            </span>
          </div>

          {/* Comments Preview */}
          {comments.length > 0 && (
            <div className="mb-2">
              {comments.slice(-2).map((comment) => (
                <div key={comment.id} className="text-sm">
                  <Link href={getUserProfileLink(comment.username)} className="font-semibold mr-2">
                    {comment.username}
                  </Link>
                  <span>{comment.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* View All Comments */}
          {commentCount > 0 && (
            <button 
              onClick={() => setShowCommentsModal(true)}
              className="text-sm text-gray-500 mb-2 block hover:text-gray-700"
            >
              Ver todos os {commentCount} comentários
            </button>
          )}

          {/* Timestamp */}
          <time className="text-xs text-gray-500 uppercase">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ptBR
            })}
          </time>
        </div>

        {/* Comment Input */}
        <div className="border-t border-gray-200 p-3">
          <form onSubmit={handleComment} className="flex items-center gap-3">
            <EmojiButton />
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="flex-1 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className={`text-sm font-semibold transition-colors ${
                comment.trim()
                  ? 'text-blue-500 hover:text-blue-600'
                  : 'text-gray-300'
              }`}
            >
              Publicar
            </button>
          </form>
        </div>
      </article>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        postId={post.id}
        comments={comments}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />

      {/* Likes Modal */}
      <LikesModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        likes={usersWhoLiked}
        onFollow={handleFollowFromLikes}
      />
    </>
  );
}

function EmojiButton() {
  return (
    <button type="button" className="p-1">
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );
}