import { Storyment } from '../types';
import { storymentApi } from './api';

// Interface para criação de storyment
export interface CreateStorymentData {
  userId: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  expiresAt?: Date;
}

// Função para obter storyments ativos
export const getActiveStoryments = async (limit = 20, offset = 0): Promise<Storyment[]> => {
  try {
    const storyments = await storymentApi.getActiveStoryments(limit, offset);
    return ensureStorymentFormatting(storyments);
  } catch (error) {
    
    return [];
  }
};

// Função para obter storyment por ID
export const getStorymentById = async (storymentId: string): Promise<Storyment | null> => {
  try {
    const storyment = await storymentApi.getById(storymentId);
    return ensureStorymentFormatting(storyment);
  } catch (error) {
    
    return null;
  }
};

// Função para obter storyments de um usuário
export const getStorymentsByUserId = async (
  userId: string,
  limit = 20,
  offset = 0,
  includeExpired = false
): Promise<Storyment[]> => {
  try {
    const storyments = await storymentApi.getByUserId(userId, limit, offset, includeExpired);
    return ensureStorymentFormatting(storyments);
  } catch (error) {
    
    return [];
  }
};

// Função para criar um storyment
export const createStoryment = async (storymentData: CreateStorymentData): Promise<Storyment | null> => {
  try {
    const storymentDataToSend = {
      ...storymentData,
      expiresAt: storymentData.expiresAt ? storymentData.expiresAt.toISOString() : undefined
    };
    
    const storyment = await storymentApi.create(storymentDataToSend);
    return ensureStorymentFormatting(storyment);
  } catch (error) {
    
    return null;
  }
};

// Função para excluir um storyment
export const deleteStoryment = async (storymentId: string): Promise<boolean> => {
  try {
    const response = await storymentApi.delete(storymentId);
    return response.success;
  } catch (error) {
    
    return false;
  }
};

// Função para marcar storyment como visualizado
export const markStorymentAsViewed = async (storymentId: string, userId: string): Promise<boolean> => {
  try {
    const response = await storymentApi.markAsViewed(storymentId, userId);
    return response.success;
  } catch (error) {
    
    return false;
  }
};

// Função para verificar se um usuário visualizou um storyment
export const hasUserViewedStoryment = async (storymentId: string, userId: string): Promise<boolean> => {
  try {
    const response = await storymentApi.hasUserViewed(storymentId, userId);
    return response.hasViewed;
  } catch (error) {
    
    return false;
  }
};

// Função auxiliar para garantir a formatação correta dos storyments
function ensureStorymentFormatting(storyment: any | any[]): any {
  if (Array.isArray(storyment)) {
    return storyment.map(s => formatStoryment(s));
  }
  return formatStoryment(storyment);
}

// Formata um storyment para garantir a compatibilidade com a interface Storyment
function formatStoryment(storyment: any): Storyment {
  return {
    ...storyment,
    hasViewed: storyment.hasViewed || false,
    createdAt: typeof storyment.createdAt === 'string' ? storyment.createdAt : storyment.createdAt.toISOString(),
    expiresAt: typeof storyment.expiresAt === 'string' ? storyment.expiresAt : storyment.expiresAt.toISOString()
  };
} 