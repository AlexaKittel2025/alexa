import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth.config';
import { getServerSession } from 'next-auth';
import { NotificationService } from '@/services/NotificationService';

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

    // Deletar notificação usando o serviço
    const success = await NotificationService.deleteNotification(notificationId, session.user.id);

    if (!success) {
      return NextResponse.json({ error: 'Notificação não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    return NextResponse.json({ error: 'Erro ao deletar notificação' }, { status: 500 });
  }
}