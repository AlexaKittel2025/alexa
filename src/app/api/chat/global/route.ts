import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { GlobalChatService } from '@/services/GlobalChatService';

// GET - Obter mensagens globais
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const messages = await GlobalChatService.getGlobalMessages(limit, offset);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens globais:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    );
  }
}

// POST - Enviar mensagem global
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
    const { content } = body;
    
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Conteúdo da mensagem é obrigatório' },
        { status: 400 }
      );
    }

    const message = await GlobalChatService.sendGlobalMessage(
      session.user.id,
      content
    );
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Erro ao enviar mensagem global:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}