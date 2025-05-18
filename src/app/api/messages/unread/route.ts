import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { ChatPrivateService } from '@/services/ChatPrivateService';

// GET - Obter contagem de mensagens não lidas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const unreadCount = await ChatPrivateService.getUnreadCount(session.user.id);
    
    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error('Erro ao buscar mensagens não lidas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens não lidas' },
      { status: 500 }
    );
  }
}