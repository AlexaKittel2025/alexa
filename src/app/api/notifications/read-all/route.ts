import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth.config';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Marcar todas as notificações do usuário como lidas
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    
    return NextResponse.json({ error: 'Erro ao atualizar notificações' }, { status: 500 });
  }
}