import { PrismaClient } from '@prisma/client';
import { ScoringService } from './ScoringService';

const prisma = new PrismaClient();

export interface FollowStatus {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export interface FollowUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
  isPro?: boolean;
  level?: number;
}

export class FollowService {
  // Seguir usuário
  static async followUser(followerId: string, followingId: string): Promise<FollowStatus> {
    try {
      // Verificar se já não está seguindo
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId
          }
        }
      });

      if (existingFollow) {
        throw new Error('Já está seguindo este usuário');
      }

      // Não pode seguir a si mesmo
      if (followerId === followingId) {
        throw new Error('Você não pode seguir a si mesmo');
      }

      // Criar relação de follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId
        }
      });

      // Criar notificação para o usuário seguido
      await prisma.notification.create({
        data: {
          type: 'follow',
          content: 'começou a seguir você',
          userId: followingId,
          senderId: followerId,
          relatedId: followerId
        }
      });

      // Atualizar pontuação (seguir alguém dá pontos)
      // await ScoringService.applyScoreToUser(followerId, 'FOLLOW_USER');

      // Obter contadores atualizados
      const [followersCount, followingCount] = await Promise.all([
        prisma.follow.count({ where: { followingId } }),
        prisma.follow.count({ where: { followerId: followingId } })
      ]);

      return {
        isFollowing: true,
        followersCount,
        followingCount
      };
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
      throw error;
    }
  }

  // Deixar de seguir usuário
  static async unfollowUser(followerId: string, followingId: string): Promise<FollowStatus> {
    try {
      // Deletar relação de follow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId
          }
        }
      });

      // Obter contadores atualizados
      const [followersCount, followingCount] = await Promise.all([
        prisma.follow.count({ where: { followingId } }),
        prisma.follow.count({ where: { followerId: followingId } })
      ]);

      return {
        isFollowing: false,
        followersCount,
        followingCount
      };
    } catch (error) {
      console.error('Erro ao deixar de seguir usuário:', error);
      throw error;
    }
  }

  // Verificar se está seguindo
  static async checkFollowStatus(followerId: string, followingId: string): Promise<FollowStatus> {
    try {
      const [isFollowing, followersCount, followingCount] = await Promise.all([
        prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId,
              followingId
            }
          }
        }),
        prisma.follow.count({ where: { followingId } }),
        prisma.follow.count({ where: { followerId: followingId } })
      ]);

      return {
        isFollowing: !!isFollowing,
        followersCount,
        followingCount
      };
    } catch (error) {
      console.error('Erro ao verificar status de follow:', error);
      return {
        isFollowing: false,
        followersCount: 0,
        followingCount: 0
      };
    }
  }

  // Obter lista de seguidores
  static async getFollowers(userId: string, options?: {
    limit?: number;
    offset?: number;
    currentUserId?: string;
  }): Promise<FollowUser[]> {
    const { limit = 20, offset = 0, currentUserId } = options || {};

    try {
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            include: {
              followers: currentUserId ? {
                where: { followerId: currentUserId }
              } : false
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      });

      return followers.map(f => ({
        id: f.follower.id,
        username: f.follower.username,
        displayName: f.follower.display_name,
        avatar: f.follower.avatar || f.follower.image,
        bio: f.follower.bio,
        isFollowing: currentUserId ? f.follower.followers.length > 0 : undefined,
        isPro: f.follower.isPro,
        level: f.follower.level
      }));
    } catch (error) {
      console.error('Erro ao buscar seguidores:', error);
      return [];
    }
  }

  // Obter lista de quem o usuário segue
  static async getFollowing(userId: string, options?: {
    limit?: number;
    offset?: number;
    currentUserId?: string;
  }): Promise<FollowUser[]> {
    const { limit = 20, offset = 0, currentUserId } = options || {};

    try {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            include: {
              followers: currentUserId ? {
                where: { followerId: currentUserId }
              } : false
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      });

      return following.map(f => ({
        id: f.following.id,
        username: f.following.username,
        displayName: f.following.display_name,
        avatar: f.following.avatar || f.following.image,
        bio: f.following.bio,
        isFollowing: currentUserId ? f.following.followers.length > 0 : undefined,
        isPro: f.following.isPro,
        level: f.following.level
      }));
    } catch (error) {
      console.error('Erro ao buscar seguindo:', error);
      return [];
    }
  }

  // Obter sugestões de quem seguir
  static async getSuggestions(userId: string, limit: number = 5): Promise<FollowUser[]> {
    try {
      // Buscar IDs de quem o usuário já segue
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });

      const followingIds = following.map(f => f.followingId);
      followingIds.push(userId); // Adicionar o próprio usuário para excluir

      // Buscar usuários populares que o usuário não segue
      const suggestions = await prisma.user.findMany({
        where: {
          id: { notIn: followingIds },
          isActive: true
        },
        orderBy: [
          { pontuacaoTotal: 'desc' },
          { followers: { _count: 'desc' } }
        ],
        take: limit,
        include: {
          _count: {
            select: {
              followers: true,
              posts: true
            }
          }
        }
      });

      return suggestions.map(user => ({
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar || user.image,
        bio: user.bio,
        isFollowing: false, // Já filtrado para não seguidos
        isPro: user.isPro,
        level: user.level,
        followersCount: user._count.followers,
        postsCount: user._count.posts
      }));
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      return [];
    }
  }

  // Buscar amigos em comum
  static async getMutualFollowers(userId1: string, userId2: string, limit: number = 5): Promise<FollowUser[]> {
    try {
      // Buscar seguidores do usuário1
      const followers1 = await prisma.follow.findMany({
        where: { followingId: userId1 },
        select: { followerId: true }
      });

      const followerIds1 = followers1.map(f => f.followerId);

      // Buscar seguidores do usuário2 que também seguem usuário1
      const mutualFollowers = await prisma.follow.findMany({
        where: {
          followingId: userId2,
          followerId: { in: followerIds1 }
        },
        include: {
          follower: true
        },
        take: limit
      });

      return mutualFollowers.map(f => ({
        id: f.follower.id,
        username: f.follower.username,
        displayName: f.follower.display_name,
        avatar: f.follower.avatar || f.follower.image,
        bio: f.follower.bio,
        isPro: f.follower.isPro,
        level: f.follower.level
      }));
    } catch (error) {
      console.error('Erro ao buscar seguidores mútuos:', error);
      return [];
    }
  }
}