import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth.config';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const notificationId = params.id;

    // Verificar se a notificação pertence ao usuário
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id
      }
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notificação não encontrada' }, { status: 404 });
    }

    // Deletar a notificação
    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    
    return NextResponse.json({ error: 'Erro ao deletar notificação' }, { status: 500 });
  }
}