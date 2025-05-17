'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes, FaEllipsisV, FaTrash, FaEdit } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: Date;
  isMyComment?: boolean;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onEditComment: (commentId: string, newText: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export default function CommentsModal({
  isOpen,
  onClose,
  postId,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
    setShowOptionsFor(null);
  };

  const handleSaveEdit = (commentId: string) => {
    if (editingText.trim()) {
      onEditComment(commentId, editingText);
      setEditingCommentId(null);
      setEditingText('');
    }
  };

  const handleDelete = (commentId: string) => {
    onDeleteComment(commentId);
    setShowOptionsFor(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Comentários</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Link href={`/perfil/${comment.userId}`}>
                    <Image
                      src={comment.userAvatar || '/images/avatar-placeholder.jpg'}
                      alt={comment.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </Link>
                  
                  <div className="flex-1">
                    {editingCommentId === comment.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm">
                          <Link 
                            href={`/perfil/${comment.userId}`}
                            className="font-semibold hover:underline"
                          >
                            {comment.username}
                          </Link>
                          <span className="ml-2">{comment.text}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-1">
                          <time className="text-xs text-gray-500">
                            {formatDistanceToNow(comment.createdAt, {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </time>
                          
                          {comment.isMyComment && (
                            <div className="relative">
                              <button
                                onClick={() => setShowOptionsFor(
                                  showOptionsFor === comment.id ? null : comment.id
                                )}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <FaEllipsisV className="w-3 h-3 text-gray-500" />
                              </button>
                              
                              {showOptionsFor === comment.id && (
                                <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
                                  <button
                                    onClick={() => handleEdit(comment)}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm w-full text-left"
                                  >
                                    <FaEdit className="w-3 h-3" />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm w-full text-left text-red-600"
                                  >
                                    <FaTrash className="w-3 h-3" />
                                    Excluir
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="flex-1 px-3 py-2 border rounded-full text-sm outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                newComment.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400'
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