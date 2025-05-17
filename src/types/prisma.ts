import { Prisma } from '@prisma/client';

export type ExtendedPost = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  tags: {
    tag: {
      name: string;
    }
  }[];
  comments: any[];
  reactions: any[];
}; 