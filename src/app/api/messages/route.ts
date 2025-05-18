import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { ChatPrivateService } from '@/services/ChatPrivateService';

// GET - Obter conversas ou mensagens
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const otherUserId = searchParams.get('userId');
    
    // Se especificou um usuário, busca mensagens da conversa
    if (otherUserId) {
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');
      
      const messages = await ChatPrivateService.getConversationMessages(
        session.user.id,
        otherUserId,
        limit,
        offset
      );
      
      // Marcar mensagens como lidas
      await ChatPrivateService.markMessagesAsRead(session.user.id, otherUserId);
      
      return NextResponse.json(messages);
    }
    
    // Caso contrário, busca todas as conversas
    const conversations = await ChatPrivateService.getUserConversations(session.user.id);
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    );
  }
}

// POST - Enviar mensagem
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { receiverId, content } = body;
    
    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Destinatário e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se pode enviar mensagem
    const canSend = await ChatPrivateService.canSendMessage(
      session.user.id,
      receiverId
    );
    
    if (!canSend) {
      return NextResponse.json(
        { error: 'Não foi possível enviar mensagem para este usuário' },
        { status: 403 }
      );
    }

    const message = await ChatPrivateService.sendPrivateMessage(
      session.user.id,
      receiverId,
      content
    );
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}