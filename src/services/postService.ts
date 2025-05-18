import { Post, ReactionType, JudgementType } from '../types';
import { postApi } from './api';

// Função para obter todos os posts
export const getAllPosts = async (limit = 20, offset = 0): Promise<Post[]> => {
  try {
    return await postApi.getAll(limit, offset);
  } catch (error) {
    
    return [];
  }
};

// Função para obter um post pelo ID
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    return await postApi.getById(postId);
  } catch (error) {
    
    return null;
  }
};

// Função para obter posts de um usuário
export const getPostsByUserId = async (
  userId: string,
  limit = 20,
  offset = 0
): Promise<Post[]> => {
  try {
    return await postApi.getByUserId(userId, limit, offset);
  } catch (error) {
    
    return [];
  }
};

// Função para obter posts por tag
export const getPostsByTag = async (
  tagName: string,
  limit = 20,
  offset = 0
): Promise<Post[]> => {
  try {
    return await postApi.getByTag(tagName, limit, offset);
  } catch (error) {
    
    return [];
  }
};

// Função para criar um novo post
export const createPost = async (postData: {
  userId?: string;
  authorId?: string;
  content: string;
  imageURL?: string;
  type?: string;
  tags?: string[];
  isGenerated?: boolean;
}): Promise<Post | null> => {
  try {
    // Garantir compatibilidade entre userId e authorId
    const finalData = {
      ...postData,
      userId: postData.userId || postData.authorId
    };
    return await postApi.create(finalData);
  } catch (error) {
    
    return null;
  }
};

// Função para atualizar um post
export const updatePost = async (
  postId: string,
  postData: Partial<Post>
): Promise<Post | null> => {
  try {
    return await postApi.update(postId, postData);
  } catch (error) {
    
    return null;
  }
};

// Função para excluir um post
export const deletePost = async (postId: string): Promise<boolean> => {
  try {
    const response = await postApi.delete(postId);
    return response.success;
  } catch (error) {
    
    return false;
  }
};

// Função para adicionar uma reação a um post
export const addReactionToPost = async (
  postId: string,
  userId: string,
  reactionType: ReactionType
): Promise<Record<string, number> | null> => {
  try {
    const response = await postApi.addReaction(postId, {
      userId,
      reactionType
    });
    return response.reactions;
  } catch (error) {
    
    return null;
  }
};

// Função para adicionar um julgamento a um post
export const addJudgementToPost = async (
  postId: string,
  userId: string,
  judgementType: JudgementType
): Promise<Record<string, number> | null> => {
  try {
    const response = await postApi.addJudgement(postId, {
      userId,
      judgementType
    });
    return response.judgements;
  } catch (error) {
    
    return null;
  }
}; 