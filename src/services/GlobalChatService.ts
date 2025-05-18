import { prisma } from '@/lib/prisma';

export interface GlobalMessage {
  id: string;
  content: string;
  senderId: string;
  isGlobal: boolean;
  createdAt: Date;
  sender: {
    id: string;
    username: string;
    display_name: string;
    image: string | null;
    isOnline: boolean;
  };
  reactions?: {
    type: string;
    count: number;
    userReacted?: boolean;
  }[];
}

export interface OnlineUser {
  id: string;
  username: string;
  display_name: string;
  image: string | null;
  lastSeen: Date;
}

export class GlobalChatService {
  // Obter mensagens globais
  static async getGlobalMessages(limit = 50, offset = 0): Promise<GlobalMessage[]> {
    const messages = await prisma.message.findMany({
      where: {
        isGlobal: true
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            display_name: true,
            image: true,
            isOnline: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Processar reações para cada mensagem
    const messagesWithReactions = await Promise.all(
      messages.map(async (message) => {
        // Aqui você poderia implementar um sistema de reações
        // Por enquanto, vamos retornar sem reações
        return {
          ...message,
          reactions: []
        };
      })
    );

    return messagesWithReactions.reverse(); // Reverter para ordem cronológica
  }

  // Enviar mensagem global
  static async sendGlobalMessage(
    senderId: string,
    content: string
  ): Promise<GlobalMessage> {
    // Verificar se o usuário pode enviar mensagem
    const user = await prisma.user.findUnique({
      where: { id: senderId },
      select: { isActive: true }
    });

    if (!user?.isActive) {
      throw new Error('Usuário não pode enviar mensagens');
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        isGlobal: true
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            display_name: true,
            image: true,
            isOnline: true
          }
        }
      }
    });

    // Criar notificação para usuários ativos (opcional)
    // Você pode implementar um sistema para notificar apenas usuários interessados
    
    return {
      ...message,
      reactions: []
    };
  }

  // Obter usuários online
  static async getOnlineUsers(): Promise<OnlineUser[]> {
    const onlineUsers = await prisma.user.findMany({
      where: {
        isOnline: true,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        display_name: true,
        image: true,
        lastLogin: true
      },
      orderBy: {
        lastLogin: 'desc'
      },
      take: 50 // Limitar para não sobrecarregar
    });

    return onlineUsers.map(user => ({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      image: user.image,
      lastSeen: user.lastLogin || new Date()
    }));
  }

  // Marcar usuário como online/offline
  static async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        lastLogin: isOnline ? new Date() : undefined
      }
    });
  }

  // Pesquisar mensagens
  static async searchMessages(query: string, limit = 20): Promise<GlobalMessage[]> {
    const messages = await prisma.message.findMany({
      where: {
        isGlobal: true,
        content: {
          contains: query,
          mode: 'insensitive'
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            display_name: true,
            image: true,
            isOnline: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return messages.map(message => ({
      ...message,
      reactions: []
    }));
  }

  // Obter estatísticas do chat
  static async getChatStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalMessages, todayMessages, onlineUsers] = await Promise.all([
      prisma.message.count({
        where: { isGlobal: true }
      }),
      prisma.message.count({
        where: {
          isGlobal: true,
          createdAt: { gte: today }
        }
      }),
      prisma.user.count({
        where: { isOnline: true }
      })
    ]);

    return {
      totalMessages,
      todayMessages,
      onlineUsers
    };
  }
}