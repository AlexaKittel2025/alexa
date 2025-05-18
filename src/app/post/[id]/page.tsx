'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaComment, FaPaperPlane, FaBookmark, FaArrowLeft } from 'react-icons/fa';
import { FaHeart as FaHeartSolid } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  lie: string;
  image?: string;
  comments: Comment[];
}

// Mock data para o post
const mockPost: Post = {
  id: '1',
  userId: '1',
  userName: 'joao_silva',
  userAvatar: '/images/avatar-placeholder.jpg',
  content: 'Acabei de descobrir que meu gato fala 5 idiomas fluentemente!',
  timestamp: '2 horas atrás',
  likes: 234,
  lie: 'mentira',
  image: '/images/avatar-placeholder.jpg',
  comments: [
    {
      id: '1',
      userId: '2',
      userName: 'maria_santos',
      userAvatar: '/images/avatar-placeholder.jpg',
      content: 'Hahahaha muito bom! O meu só fala português mesmo 😂',
      timestamp: '1 hora atrás',
      likes: 12
    },
    {
      id: '2',
      userId: '3',
      userName: 'pedro_costa',
      userAvatar: '/images/avatar-placeholder.jpg',
      content: 'O meu cachorro é PhD em física quântica',
      timestamp: '45 minutos atrás',
      likes: 8
    },
    {
      id: '3',
      userId: '4',
      userName: 'ana_oliveira',
      userAvatar: '/images/avatar-placeholder.jpg',
      content: 'Adorei! Qual é o idioma preferido dele?',
      timestamp: '30 minutos atrás',
      likes: 5
    }
  ]
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post>(mockPost);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setPost(prev => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'usuario_atual',
      userAvatar: '/images/avatar-placeholder.jpg',
      content: newComment,
      timestamp: 'agora',
      likes: 0
    };

    setPost(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));
    setNewComment('');
  };

  const handleCommentLike = (commentId: string) => {
    setPost(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-900 rounded-full transition-colors"
          >
            <FaArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Publicação</h1>
          <div className="w-10" /> {/* Espaçador para centralizar o título */}
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Post */}
        <article className="bg-black border-b border-gray-800">
          {/* Header do Post */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Image
                src={post.userAvatar}
                alt={post.userName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <Link href={`/perfil/${post.userId}`} className="font-semibold text-white hover:underline">
                  {post.userName}
                </Link>
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* Imagem */}
          {post.image && (
            <div className="relative aspect-square bg-gray-900">
              <Image
                src={post.image}
                alt="Post"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Ações */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button onClick={handleLike} className="hover:opacity-60 transition-opacity">
                  {liked ? (
                    <FaHeartSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaHeart className="w-6 h-6 text-white" />
                  )}
                </button>
                <button className="hover:opacity-60 transition-opacity">
                  <FaComment className="w-6 h-6 text-white" />
                </button>
                <button className="hover:opacity-60 transition-opacity">
                  <FaPaperPlane className="w-6 h-6 text-white -rotate-45" />
                </button>
              </div>
              <button onClick={() => setSaved(!saved)} className="hover:opacity-60 transition-opacity">
                <FaBookmark
                  className={`w-6 h-6 ${saved ? 'text-white' : 'text-white'}`}
                />
              </button>
            </div>

            {/* Curtidas */}
            <p className="font-semibold mb-2 text-white">{post.likes} curtidas</p>

            {/* Conteúdo */}
            <div className="mb-4">
              <p className="text-white">
                <span className="font-semibold mr-2">{post.userName}</span>
                {post.content}
              </p>
              {post.lie && (
                <span className="inline-block mt-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                  #{post.lie}
                </span>
              )}
            </div>
          </div>
        </article>

        {/* Comentários */}
        <div className="bg-black">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Comentários</h2>
          </div>
          
          {post.comments.map((comment) => (
            <div key={comment.id} className="p-4 border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
              <div className="flex space-x-3">
                <Image
                  src={comment.userAvatar}
                  alt={comment.userName}
                  width={32}
                  height={32}
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <Link href={`/perfil/${comment.userId}`} className="font-semibold hover:underline">
                          {comment.userName}
                        </Link>
                        <span className="ml-2 font-normal">{comment.content}</span>
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{comment.timestamp}</span>
                        <button className="hover:text-gray-200">
                          {comment.likes} curtidas
                        </button>
                        <button className="hover:text-gray-200">Responder</button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className="ml-4 hover:opacity-60 transition-opacity"
                    >
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Adicionar Comentário */}
        <div className="sticky bottom-0 bg-black border-t border-gray-800 p-4">
          <form onSubmit={handleAddComment} className="flex items-center space-x-3">
            <Image
              src="/images/avatar-placeholder.jpg"
              alt="Seu avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="flex-1 bg-gray-900 text-white placeholder-gray-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                newComment.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Publicar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}