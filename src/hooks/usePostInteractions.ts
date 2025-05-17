'use client';

import { useState, useEffect } from 'react';

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

interface UsePostInteractionsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialLikedByMe: boolean;
  initialSaved: boolean;
}

export function usePostInteractions({
  postId,
  initialLikes,
  initialComments,
  initialLikedByMe,
  initialSaved
}: UsePostInteractionsProps) {
  const [liked, setLiked] = useState(initialLikedByMe);
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(initialSaved);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [usersWhoLiked, setUsersWhoLiked] = useState<UserLike[]>([]);

  // Sync state with props
  useEffect(() => {
    setLiked(initialLikedByMe);
    setLikes(initialLikes);
    setSaved(initialSaved);
  }, [initialLikedByMe, initialLikes, initialSaved]);

  // Load saved comments from localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem(`post-${postId}-comments`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
      setCommentCount(JSON.parse(savedComments).length);
    }
  }, [postId]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`post-${postId}-comments`, JSON.stringify(comments));
  }, [comments, postId]);

  // Load saved likes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem(`post-${postId}-likes`);
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
      if (initialLikes > 0) {
        const initialLikesArray = mockLikes.slice(0, Math.min(initialLikes, mockLikes.length));
        setUsersWhoLiked(initialLikesArray);
      } else {
        setUsersWhoLiked([]);
      }
    }
  }, [postId, initialLikes]);

  // Save likes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`post-${postId}-likes`, JSON.stringify(usersWhoLiked));
  }, [usersWhoLiked, postId]);

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
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleAddComment = (text: string): Comment => {
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
    
    return newComment;
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

  return {
    liked,
    likes,
    saved,
    comments,
    commentCount,
    usersWhoLiked,
    handleLike,
    handleSave,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleFollowFromLikes
  };
}

export type { Comment, UserLike };