import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth.config';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Deletar todas as notificações lidas do usuário
    await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
        isRead: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    
    return NextResponse.json({ error: 'Erro ao deletar notificações' }, { status: 500 });
  }
}