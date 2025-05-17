import { Post, ReactionType, JudgementType } from '../types';
import { postApi } from './api';

// Função para obter todos os posts
export const getAllPosts = async (limit = 20, offset = 0): Promise<Post[]> => {
  try {
    return await postApi.getAll(limit, offset);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }
};

// Função para obter um post pelo ID
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    return await postApi.getById(postId);
  } catch (error) {
    console.error('Erro ao buscar post por ID:', error);
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
    console.error('Erro ao buscar posts do usuário:', error);
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
    console.error('Erro ao buscar posts por tag:', error);
    return [];
  }
};

// Função para criar um novo post
export const createPost = async (postData: {
  userId: string;
  content: string;
  imageURL?: string;
  tags?: string[];
  isGenerated?: boolean;
}): Promise<Post | null> => {
  try {
    return await postApi.create(postData);
  } catch (error) {
    console.error('Erro ao criar post:', error);
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
    console.error('Erro ao atualizar post:', error);
    return null;
  }
};

// Função para excluir um post
export const deletePost = async (postId: string): Promise<boolean> => {
  try {
    const response = await postApi.delete(postId);
    return response.success;
  } catch (error) {
    console.error('Erro ao excluir post:', error);
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
    console.error('Erro ao adicionar reação ao post:', error);
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
    console.error('Erro ao adicionar julgamento ao post:', error);
    return null;
  }
}; 