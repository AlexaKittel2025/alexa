import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth.config';
import { getServerSession } from 'next-auth';
import { NotificationService } from '@/services/NotificationService';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Marcar todas as notificações como lidas usando o serviço
    const success = await NotificationService.markAllAsRead(session.user.id);

    if (!success) {
      return NextResponse.json({ error: 'Erro ao marcar notificações como lidas' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error);
    return NextResponse.json({ error: 'Erro ao marcar notificações como lidas' }, { status: 500 });
  }
}