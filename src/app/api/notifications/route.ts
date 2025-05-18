import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth.config';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar notificações do usuário
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limitar a 50 notificações recentes
    });

    // Formatar os dados
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      content: notification.content,
      is_read: notification.isRead,
      related_id: notification.relatedId,
      sender_id: notification.senderId,
      created_at: notification.createdAt.toISOString()
    }));

    return NextResponse.json(formattedNotifications);
  } catch (error) {

    // Se a tabela não existir, retornar array vazio
    if (error.code === 'P2021') {
      return NextResponse.json([]);
    }
    
    return NextResponse.json({ error: 'Erro ao buscar notificações' }, { status: 500 });
  }
}

// Criar nova notificação
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { type, content, relatedId, userId } = body;

    const notification = await prisma.notification.create({
      data: {
        type,
        content,
        relatedId,
        userId,
        senderId: session.user.id
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    
    return NextResponse.json({ error: 'Erro ao criar notificação' }, { status: 500 });
  }
}