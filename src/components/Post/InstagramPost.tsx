'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaComment, FaPaperPlane, FaBookmark } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LikesModal from '../LikesModal';
import { getUserProfileLink } from '@/utils/userUtils';
import ReactionsBar from './ReactionsBar';
import CommentSystem from './CommentSystem';
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
  currentUser?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
}

export default function InstagramPost({ post, currentUser, onLike, onSave, onShare, onComment }: InstagramPostProps) {
  const [saved, setSaved] = useState(post.saved || false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [usersWhoLiked, setUsersWhoLiked] = useState<UserLike[]>([]);
  const [totalReactions, setTotalReactions] = useState(post.likes);

  // Sync state with props
  useEffect(() => {
    setSaved(post.saved || false);
  }, [post.saved]);

  const handleReactionsUpdate = (reactions: any) => {
    // Calcular o total de reações
    const total = Object.values(reactions).reduce((sum: number, count: any) => sum + count, 0);
    setTotalReactions(total);
  };

  const handleCommentsUpdate = (count: number) => {
    setCommentCount(count);
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

  const contentPreview = post.content.length > 100 && !showFullContent
    ? post.content.slice(0, 100) + '...'
    : post.content;

  return (
    <>
      <article className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
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
            <span className="font-medium text-sm dark:text-white">{post.user.username}</span>
          </Link>
          
          <button className="p-2 dark:text-gray-300">
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
          <div className="mb-3">
            <ReactionsBar 
              postId={post.id}
              authorId={post.user.id}
              onUpdate={handleReactionsUpdate}
              onComment={() => setShowCommentInput(!showCommentInput)}
              onShare={handleShare}
              onSave={handleSave}
              isSaved={saved}
            />
          </div>

          {/* Likes */}
          <div className="mb-2">
            <button 
              onClick={() => setShowLikesModal(true)}
              className="font-semibold text-sm hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors"
            >
              {totalReactions.toLocaleString('pt-BR')} curtidas
            </button>
          </div>

          {/* Content */}
          <div className="mb-2">
            <Link href={`/perfil/${post.user.id}`} className="font-semibold text-sm mr-2 dark:text-white">
              {post.user.username}
            </Link>
            <span className="text-sm dark:text-gray-300">
              {contentPreview}
              {post.content.length > 100 && !showFullContent && (
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-gray-500 dark:text-gray-400 ml-1"
                >
                  mais
                </button>
              )}
            </span>
          </div>

          {/* View All Comments */}
          {commentCount > 0 && (
            <button 
              onClick={() => setShowCommentsModal(true)}
              className="text-sm text-gray-500 dark:text-gray-400 mb-2 block hover:text-gray-700 dark:hover:text-gray-300"
            >
              Ver todos os {commentCount} comentários
            </button>
          )}

          {/* Timestamp */}
          <time className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ptBR
            })}
          </time>
        </div>

        {/* Comment Input - Inline */}
        {showCommentInput && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <CommentSystem 
              postId={post.id}
              authorId={post.user.id}
              onCommentsUpdate={handleCommentsUpdate}
              isModal={false}
            />
          </div>
        )}
      </article>

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">Comentários</h2>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CommentSystem 
                postId={post.id}
                authorId={post.user.id}
                onClose={() => setShowCommentsModal(false)}
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Likes Modal */}
      <LikesModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        likes={usersWhoLiked}
        onFollow={() => {}}
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