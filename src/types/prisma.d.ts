import { Post, User, Comment, Reaction } from '@prisma/client';

// Tipo estendido para Post com relações incluídas
export interface ExtendedPost extends Post {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  comments: Comment[];
  reactions: Reaction[];
  tags?: {
    tag: {
      name: string;
    }
  }[];
  // Campos extras para compatibilidade com o Firebase
  uid?: string;
  displayName?: string;
  photoURL?: string | null;
}

// Tipo estendido para User com relações incluídas
export interface ExtendedUser extends User {
  posts?: Post[];
  comments?: Comment[];
  reactions?: Reaction[];
  stats?: {
    totalPontos: number;
    qtdPosts: number;
    qtdReacoes: number;
  };
  // Campos extras para compatibilidade com o Firebase
  uid?: string;
  displayName?: string;
  photoURL?: string | null;
} 