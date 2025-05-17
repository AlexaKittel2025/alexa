'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaHeart, FaComment, FaPaperPlane, FaBookmark } from 'react-icons/fa';
import { FaHeart as FaHeartSolid } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
}

export default function InstagramPost({ post }: InstagramPostProps) {
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved || false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // TODO: Implementar envio de comentário
      setComment('');
    }
  };

  const contentPreview = post.content.length > 100 && !showFullContent
    ? post.content.slice(0, 100) + '...'
    : post.content;

  return (
    <article className="bg-white border border-gray-200 rounded-lg mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link href={`/perfil/${post.user.id}`} className="flex items-center gap-3">
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
            
            <button className="transition-transform active:scale-110">
              <FaComment className="w-6 h-6 text-gray-900 hover:text-gray-600" />
            </button>
            
            <button className="transition-transform active:scale-110">
              <FaPaperPlane className="w-6 h-6 text-gray-900 hover:text-gray-600 -rotate-45" />
            </button>
          </div>
          
          <button onClick={handleSave} className="transition-transform active:scale-110">
            {saved ? (
              <FaBookmark className="w-6 h-6 text-gray-900 fill-current" />
            ) : (
              <FaBookmark className="w-6 h-6 text-gray-900 hover:text-gray-600" />
            )}
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <button className="font-semibold text-sm">
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
        {post.comments > 0 && (
          <Link href={`/post/${post.id}`} className="text-sm text-gray-500 mb-2 block">
            Ver todos os {post.comments} comentários
          </Link>
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
