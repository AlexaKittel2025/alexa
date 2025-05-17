import { prisma } from '@/lib/prisma';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface UpdateUserData {
  name?: string;
  email?: string;
  photoUrl?: string;
  bio?: string;
  level?: number;
  isPro?: boolean;
}

export class UserDetailsService {
  // Obter usuário com detalhes
  static async getUserWithDetails(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        posts: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            tags: {
              include: {
                tag: true
              }
            }
          }
        },
        stats: true
      }
    });
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Formatar para serialização segura
    return {
      ...user,
      password: undefined, // Remove a senha por segurança
      emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      posts: user.posts.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }))
    };
  }
  
  // Atualizar usuário
  static async updateUser(userId: string, data: UpdateUserData) {
    // Verificar se o usuário existe
    const existingUser = await db.select().from(users).where(eq(users.id, userId));
    
    if (existingUser.length === 0) {
      throw new Error('Usuário não encontrado');
    }
    
    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.photoUrl !== undefined) updateData.photoUrl = data.photoUrl;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.level !== undefined) updateData.level = data.level;
    if (data.isPro !== undefined) updateData.isPro = data.isPro;
    
    // Atualizar usuário
    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser[0];
  }
  
  // Deletar usuário
  static async deleteUser(userId: string) {
    // Verificar se o usuário existe
    const existingUser = await db.select().from(users).where(eq(users.id, userId));
    
    if (existingUser.length === 0) {
      throw new Error('Usuário não encontrado');
    }
    
    // Deletar usuário
    await db.delete(users).where(eq(users.id, userId));
    
    return { message: 'Usuário removido com sucesso' };
  }
}