import { Server } from 'socket.io';
import http from 'http';
import { prisma } from './prisma';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta';

// Função para configurar o servidor Socket.io
export const setupSocketServer = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3002'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware para autenticação
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Autenticação necessária'));
    }

    try {
      const decoded = verify(token, JWT_SECRET) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      return next(new Error('Token inválido'));
    }
  });

  // Gerenciamento de conexões
  io.on('connection', async (socket) => {
    const userId = socket.data.userId;

    // Associar usuário às suas salas de chat
    try {
      const userRooms = await prisma.chatRoomUser.findMany({
        where: { userId: userId },
        select: { roomId: true }
      });

      for (const room of userRooms) {
        socket.join(room.roomId);
      }
      
      // Adicionar ao chat global
      const globalRoom = await prisma.chatRoom.findFirst({
        where: { type: 'global' }
      });
      
      if (globalRoom) {
        socket.join(globalRoom.id);
      }
    } catch (error) {
      
    }

    // Evento quando usuário fica online
    socket.on('user:online', async ({ userId }) => {
      try {
        // Notificar contatos que o usuário está online
        const userContacts = await prisma.chatRoomUser.findMany({
          where: {
            room: {
              type: 'private',
              participants: {
                some: {
                  userId
                }
              }
            },
            NOT: {
              userId
            }
          },
          select: {
            userId: true
          }
        });

        const contactIds = userContacts.map(contact => contact.userId);
        for (const contactId of contactIds) {
          socket.to(contactId).emit('user:status', { userId, status: 'online' });
        }
      } catch (error) {
        
      }
    });

    // Evento de envio de mensagem
    socket.on('message:send', async (message) => {
      try {
        // Emitir mensagem para a sala
        socket.to(message.roomId).emit('message:receive', message);
        
        // Atualizar última mensagem da sala
        await prisma.chatRoom.update({
          where: { id: message.roomId },
          data: {
            updatedAt: new Date()
          }
        });
      } catch (error) {
        
      }
    });

    // Evento de digitação
    socket.on('user:typing', ({ roomId, userId, isTyping }) => {
      socket.to(roomId).emit('user:typing', { userId, isTyping });
    });

    // Evento de leitura de mensagens
    socket.on('messages:read', async ({ roomId, userId }) => {
      try {
        // Atualizar status das mensagens como lidas
        await prisma.chatMessage.updateMany({
          where: {
            roomId,
            receiverId: userId,
            isRead: false
          },
          data: {
            isRead: true
          }
        });

        // Notificar remetente que as mensagens foram lidas
        socket.to(roomId).emit('messages:read', { roomId, userId });
      } catch (error) {
        
      }
    });

    // Evento de desconexão
    socket.on('disconnect', async () => {
      
      try {
        // Notificar contatos que o usuário está offline
        const userContacts = await prisma.chatRoomUser.findMany({
          where: {
            room: {
              type: 'private',
              participants: {
                some: {
                  userId
                }
              }
            },
            NOT: {
              userId
            }
          },
          select: {
            userId: true
          }
        });

        const contactIds = userContacts.map(contact => contact.userId);
        for (const contactId of contactIds) {
          socket.to(contactId).emit('user:status', { userId, status: 'offline' });
        }
      } catch (error) {
        
      }
    });
  });

  return io;
}; 