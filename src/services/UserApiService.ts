import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { sql } from '@vercel/postgres';

export interface UserFilters {
  limit?: number;
  offset?: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  photoUrl?: string;
  bio?: string;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export class UserApiService {
  // Buscar usuários com paginação
  static async getUsersWithPagination(filters: UserFilters) {
    const { limit = 10, offset = 0 } = filters;
    
    // Buscar usuários com paginação
    const result = await db.select().from(users).limit(limit).offset(offset);
    
    // Contar o total de usuários
    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(users);
    
    const total = Number(countResult[0]?.count || 0);
    
    return {
      users: result,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }
  
  // Criar novo usuário
  static async createUser(data: CreateUserData) {
    // Validar campos obrigatórios
    if (!data.name || !data.email) {
      throw new Error('Os campos nome e email são obrigatórios');
    }
    
    try {
      // Inserir usuário
      const newUser = await db.insert(users).values({
        name: data.name,
        email: data.email,
        photoUrl: data.photoUrl,
        bio: data.bio
      }).returning();
      
      return newUser[0];
    } catch (error) {
      // Verificar se é um erro de duplicidade de email
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('Email já cadastrado');
      }
      throw error;
    }
  }
}