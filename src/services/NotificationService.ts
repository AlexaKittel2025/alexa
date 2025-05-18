import { PrismaClient } from '@prisma/client';
import { Ably } from 'ably';

const prisma = new PrismaClient();

// Tipos de notificação
export type NotificationType = 
  | 'follow'
  | 'like'
  | 'comment'
  | 'battle_challenge'
  | 'battle_result'
  | 'achievement'
  | 'level_up'
  | 'mention'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  content: string;
  userId: string;
  senderId?: string;
  relatedId?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  sender?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
}

export interface NotificationCreateInput {
  type: NotificationType;
  title?: string;
  content: string;
  userId: string;
  senderId?: string;
  relatedId?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  private static ably: Ably.Realtime | null = null;

  // Inicializar conexão Ably para notificações real-time
  private static initAbly() {
    if (!this.ably && process.env.ABLY_API_KEY) {
      this.ably = new Ably.Realtime(process.env.ABLY_API_KEY);
    }
    return this.ably;
  }

  // Criar nova notificação
  static async createNotification(data: NotificationCreateInput): Promise<Notification> {
    try {
      const notification = await prisma.notification.create({
        data: {
          ...data,
          metadata: data.metadata ? JSON.stringify(data.metadata) : undefined
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              display_name: true,
              avatar: true,
              image: true
            }
          }
        }
      });

      // Formatar notificação
      const formattedNotification = this.formatNotification(notification);

      // Enviar notificação real-time via Ably
      await this.sendRealtimeNotification(formattedNotification);

      return formattedNotification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  // Obter notificações do usuário
  static async getUserNotifications(
    userId: string, 
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
    }
  ): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const { limit = 20, offset = 0, unreadOnly = false } = options || {};

    try {
      // Buscar notificações
      const where: any = { userId };
      if (unreadOnly) {
        where.isRead = false;
      }

      const [notifications, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                display_name: true,
                avatar: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        }),
        prisma.notification.count({
          where: {
            userId,
            isRead: false
          }
        })
      ]);

      // Formatar notificações
      const formattedNotifications = notifications.map(n => this.formatNotification(n));

      return {
        notifications: formattedNotifications,
        unreadCount
      };
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return {
        notifications: [],
        unreadCount: 0
      };
    }
  }

  // Marcar notificação como lida
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId // Garantir que pertence ao usuário
        },
        data: {
          isRead: true
        }
      });
      return true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }
  }

  // Marcar todas as notificações como lidas
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false
        },
        data: {
          isRead: true
        }
      });
      return true;
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      return false;
    }
  }

  // Deletar notificação
  static async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.delete({
        where: {
          id: notificationId,
          userId // Garantir que pertence ao usuário
        }
      });
      return true;
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      return false;
    }
  }

  // Enviar notificação real-time via Ably
  private static async sendRealtimeNotification(notification: Notification) {
    try {
      const ably = this.initAbly();
      if (!ably) return;

      const channel = ably.channels.get(`user:${notification.userId}:notifications`);
      await channel.publish('new-notification', notification);
    } catch (error) {
      console.error('Erro ao enviar notificação real-time:', error);
    }
  }

  // Formatar notificação do banco de dados
  private static formatNotification(notification: any): Notification {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      userId: notification.userId,
      senderId: notification.senderId,
      relatedId: notification.relatedId,
      metadata: notification.metadata ? JSON.parse(notification.metadata) : undefined,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      sender: notification.sender ? {
        id: notification.sender.id,
        username: notification.sender.username,
        displayName: notification.sender.display_name,
        avatar: notification.sender.avatar || notification.sender.image
      } : undefined
    };
  }

  // Criar notificações específicas por tipo
  static async createFollowNotification(followerId: string, followingId: string) {
    const follower = await prisma.user.findUnique({
      where: { id: followerId },
      select: { username: true, display_name: true }
    });

    if (!follower) return;

    return this.createNotification({
      type: 'follow',
      title: 'Novo seguidor',
      content: `${follower.display_name || follower.username} começou a seguir você`,
      userId: followingId,
      senderId: followerId,
      relatedId: followerId
    });
  }

  static async createLikeNotification(likerId: string, postId: string, postAuthorId: string) {
    const [liker, post] = await Promise.all([
      prisma.user.findUnique({
        where: { id: likerId },
        select: { username: true, display_name: true }
      }),
      prisma.post.findUnique({
        where: { id: postId },
        select: { content: true }
      })
    ]);

    if (!liker || !post || likerId === postAuthorId) return;

    const postPreview = post.content.substring(0, 50) + (post.content.length > 50 ? '...' : '');

    return this.createNotification({
      type: 'like',
      title: 'Nova curtida',
      content: `${liker.display_name || liker.username} curtiu sua publicação: "${postPreview}"`,
      userId: postAuthorId,
      senderId: likerId,
      relatedId: postId
    });
  }

  static async createCommentNotification(
    commenterId: string, 
    postId: string, 
    postAuthorId: string, 
    commentPreview: string
  ) {
    const commenter = await prisma.user.findUnique({
      where: { id: commenterId },
      select: { username: true, display_name: true }
    });

    if (!commenter || commenterId === postAuthorId) return;

    return this.createNotification({
      type: 'comment',
      title: 'Novo comentário',
      content: `${commenter.display_name || commenter.username} comentou: "${commentPreview}"`,
      userId: postAuthorId,
      senderId: commenterId,
      relatedId: postId
    });
  }

  static async createBattleChallengeNotification(
    challengerId: string,
    challengedId: string,
    battleId: string
  ) {
    const challenger = await prisma.user.findUnique({
      where: { id: challengerId },
      select: { username: true, display_name: true }
    });

    if (!challenger) return;

    return this.createNotification({
      type: 'battle_challenge',
      title: 'Desafio de batalha',
      content: `${challenger.display_name || challenger.username} te desafiou para uma batalha!`,
      userId: challengedId,
      senderId: challengerId,
      relatedId: battleId
    });
  }

  static async createBattleResultNotification(
    winnerId: string,
    loserId: string,
    battleId: string,
    isWinner: boolean
  ) {
    const winner = await prisma.user.findUnique({
      where: { id: winnerId },
      select: { username: true, display_name: true }
    });

    if (!winner) return;

    return this.createNotification({
      type: 'battle_result',
      title: isWinner ? 'Vitória na batalha!' : 'Resultado da batalha',
      content: isWinner 
        ? `Parabéns! Você venceu a batalha contra ${winner.display_name || winner.username}!`
        : `${winner.display_name || winner.username} venceu a batalha`,
      userId: isWinner ? winnerId : loserId,
      senderId: isWinner ? loserId : winnerId,
      relatedId: battleId,
      metadata: {
        isWinner
      }
    });
  }

  static async createAchievementNotification(
    userId: string,
    achievementName: string,
    achievementDescription: string,
    points: number
  ) {
    return this.createNotification({
      type: 'achievement',
      title: 'Nova conquista desbloqueada!',
      content: `${achievementName}: ${achievementDescription}`,
      userId,
      metadata: {
        achievementName,
        points
      }
    });
  }

  static async createLevelUpNotification(
    userId: string,
    newLevel: number,
    pointsToNextLevel: number
  ) {
    return this.createNotification({
      type: 'level_up',
      title: `Parabéns! Você alcançou o nível ${newLevel}!`,
      content: `Continue assim! Faltam ${pointsToNextLevel} pontos para o próximo nível.`,
      userId,
      metadata: {
        newLevel,
        pointsToNextLevel
      }
    });
  }

  static async createMentionNotification(
    mentionerId: string,
    mentionedId: string,
    postId: string,
    context: string
  ) {
    const mentioner = await prisma.user.findUnique({
      where: { id: mentionerId },
      select: { username: true, display_name: true }
    });

    if (!mentioner) return;

    return this.createNotification({
      type: 'mention',
      title: 'Você foi mencionado',
      content: `${mentioner.display_name || mentioner.username} mencionou você: "${context}"`,
      userId: mentionedId,
      senderId: mentionerId,
      relatedId: postId
    });
  }

  static async createSystemNotification(
    userId: string,
    title: string,
    content: string,
    metadata?: Record<string, any>
  ) {
    return this.createNotification({
      type: 'system',
      title,
      content,
      userId,
      metadata
    });
  }
}