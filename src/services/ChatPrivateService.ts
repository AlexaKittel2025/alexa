import { prisma } from '@/lib/prisma';

export interface PrivateMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  readAt: Date | null;
  sender: {
    id: string;
    username: string;
    display_name: string;
    image: string | null;
  };
  receiver: {
    id: string;
    username: string;
    display_name: string;
    image: string | null;
  };
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    username: string;
    display_name: string;
    image: string | null;
    isOnline: boolean;
  };
  lastMessage: {
    content: string;
    createdAt: Date;
    senderId: string;
  } | null;
  unreadCount: number;
}

export class ChatPrivateService {
  // Obter conversas do usuário
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    // Buscar todas as mensagens do usuário (enviadas e recebidas)
    const messages = await prisma.message.findMany({
      where: {
        isGlobal: false,
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
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
        },
        receiver: {
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
      }
    });

    // Agrupar mensagens por conversa
    const conversationsMap = new Map<string, Conversation>();

    for (const message of messages) {
      const otherUserId = message.senderId === userId ? message.receiverId! : message.senderId;
      const otherUser = message.senderId === userId ? message.receiver! : message.sender;

      if (!conversationsMap.has(otherUserId)) {
        const unreadCount = await prisma.message.count({
          where: {
            receiverId: userId,
            senderId: otherUserId,
            readAt: null,
            isGlobal: false
          }
        });

        conversationsMap.set(otherUserId, {
          id: otherUserId,
          participant: otherUser,
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
            senderId: message.senderId
          },
          unreadCount
        });
      }
    }

    return Array.from(conversationsMap.values());
  }

  // Obter mensagens de uma conversa
  static async getConversationMessages(
    userId: string,
    otherUserId: string,
    limit = 50,
    offset = 0
  ): Promise<PrivateMessage[]> {
    const messages = await prisma.message.findMany({
      where: {
        isGlobal: false,
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            display_name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            display_name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return messages;
  }

  // Enviar mensagem privada
  static async sendPrivateMessage(
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<PrivateMessage> {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        isGlobal: false
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            display_name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            display_name: true,
            image: true
          }
        }
      }
    });

    // Criar notificação para o destinatário
    await prisma.notification.create({
      data: {
        type: 'message',
        content: `Nova mensagem de ${message.sender.display_name}`,
        userId: receiverId,
        senderId,
        relatedId: message.id
      }
    });

    return message;
  }

  // Marcar mensagens como lidas
  static async markMessagesAsRead(
    receiverId: string,
    senderId: string
  ): Promise<void> {
    await prisma.message.updateMany({
      where: {
        receiverId,
        senderId,
        readAt: null,
        isGlobal: false
      },
      data: {
        readAt: new Date()
      }
    });
  }

  // Buscar usuários para iniciar conversa
  static async searchUsers(query: string, currentUserId: string): Promise<any[]> {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { display_name: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        username: true,
        display_name: true,
        image: true,
        isOnline: true
      },
      take: 10
    });

    return users;
  }

  // Verificar se pode enviar mensagem
  static async canSendMessage(senderId: string, receiverId: string): Promise<boolean> {
    // Por enquanto, qualquer usuário pode enviar mensagem para qualquer outro
    // Futuramente pode implementar bloqueios, privacidade, etc.
    
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { isActive: true }
    });

    return receiver?.isActive === true;
  }

  // Obter contagem de mensagens não lidas
  static async getUnreadCount(userId: string): Promise<number> {
    return await prisma.message.count({
      where: {
        receiverId: userId,
        readAt: null,
        isGlobal: false
      }
    });
  }

  // Deletar conversa (ocultar mensagens)
  static async deleteConversation(userId: string, otherUserId: string): Promise<void> {
    // Não vamos deletar fisicamente, apenas marcar como deletada para o usuário
    // Isso requer adicionar um campo no schema, por enquanto vamos apenas documentar
    
    // TODO: Implementar soft delete de conversas
    throw new Error('Funcionalidade ainda não implementada');
  }
}