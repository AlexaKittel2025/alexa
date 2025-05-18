import express from 'express';
import { prisma } from '../prisma';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Middleware de autenticação para todas as rotas de chat
router.use(authenticateJWT);

// Obter todas as salas de chat de um usuário
router.get('/rooms/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                photoURL: true
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Formatar o resultado para o cliente
    const formattedRooms = chatRooms.map(room => {
      // Para chats privados, encontre o outro usuário
      const otherParticipants = room.participants
        .filter(p => p.userId !== userId)
        .map(p => p.user);
      
      const lastMessage = room.messages[0] || null;

      return {
        id: room.id,
        name: room.name || (otherParticipants[0]?.displayName || 'Chat'),
        type: room.type,
        participants: room.participants.map(p => p.user),
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        lastMessage
      };
    });

    res.json({
      success: true,
      data: formattedRooms
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar salas de chat'
    });
  }
});

// Obter a sala de chat global
router.get('/rooms/global', async (req, res) => {
  try {
    let globalRoom = await prisma.chatRoom.findFirst({
      where: {
        type: 'global'
      }
    });

    // Se não existir, criar uma sala global
    if (!globalRoom) {
      globalRoom = await prisma.chatRoom.create({
        data: {
          name: 'Chat Global',
          type: 'global'
        }
      });
    }

    res.json({
      success: true,
      data: globalRoom
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar sala global'
    });
  }
});

// Obter ou criar sala privada entre dois usuários
router.post('/rooms/private', async (req, res) => {
  try {
    const { userId, receiverId } = req.body;

    if (!userId || !receiverId) {
      return res.status(400).json({
        success: false,
        error: 'IDs de usuários ausentes'
      });
    }

    // Verificar se já existe uma sala entre estes usuários
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        type: 'private',
        AND: [
          {
            participants: {
              some: {
                userId: userId
              }
            }
          },
          {
            participants: {
              some: {
                userId: receiverId
              }
            }
          }
        ]
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                photoURL: true
              }
            }
          }
        }
      }
    });

    if (existingRoom) {
      return res.json({
        success: true,
        data: {
          ...existingRoom,
          participants: existingRoom.participants.map(p => p.user)
        }
      });
    }

    // Criar nova sala
    const newRoom = await prisma.chatRoom.create({
      data: {
        type: 'private',
        participants: {
          create: [
            {
              userId: userId
            },
            {
              userId: receiverId
            }
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                photoURL: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        ...newRoom,
        participants: newRoom.participants.map(p => p.user)
      }
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Erro ao obter/criar sala privada'
    });
  }
});

// Obter mensagens de uma sala
router.get('/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, before } = req.query;

    const parsedLimit = parseInt(limit as string) || 50;
    
    const whereClause: any = {
      roomId
    };

    if (before) {
      whereClause.createdAt = {
        lt: new Date(before as string)
      };
    }

    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: parsedLimit,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            photoURL: true
          }
        }
      }
    });

    // Inverter para ordem cronológica
    messages.reverse();

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar mensagens'
    });
  }
});

// Enviar mensagem
router.post('/messages', async (req, res) => {
  try {
    const { roomId, senderId, receiverId, content } = req.body;

    if (!roomId || !senderId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Dados insuficientes para enviar mensagem'
      });
    }

    // Verificar se a sala existe
    const room = await prisma.chatRoom.findUnique({
      where: {
        id: roomId
      }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Sala de chat não encontrada'
      });
    }

    // Criar nova mensagem
    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        receiverId: receiverId || senderId, // Para chat global, receiverId pode ser o próprio senderId
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            photoURL: true
          }
        }
      }
    });

    // Atualizar timestamp da sala
    await prisma.chatRoom.update({
      where: {
        id: roomId
      },
      data: {
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar mensagem'
    });
  }
});

// Marcar mensagens como lidas
router.put('/messages/read', async (req, res) => {
  try {
    const { roomId, receiverId } = req.body;

    if (!roomId || !receiverId) {
      return res.status(400).json({
        success: false,
        error: 'Dados insuficientes'
      });
    }

    const result = await prisma.chatMessage.updateMany({
      where: {
        roomId,
        receiverId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json({
      success: true,
      data: {
        updatedCount: result.count
      }
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Erro ao marcar mensagens como lidas'
    });
  }
});

export default router; 