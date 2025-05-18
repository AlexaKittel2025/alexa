import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { ChatApiService } from '@/services/ChatApiService';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';

// GET - Obter mensagens de chat
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const before = searchParams.get('before');
    
    const messages = await ChatApiService.getMessages(
      limit,
      before ? new Date(before) : undefined
    );
    
    // Formatar as datas para serialização
    const formattedMessages = messages.map(msg => ({
      ...msg,
      createdAt: msg.createdAt.toISOString()
    }));
    
    return NextResponse.json(formattedMessages);
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    );
  }
}

// POST - Enviar nova mensagem de chat
export async function POST(req: Request) {
  try {
    // Verificar autenticação
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }
    
    // Verificar token
    const payload = await verifyToken(token);
    if (!payload || !payload.data) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
    
    const { text } = await req.json();
    
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Mensagem não pode estar vazia' },
        { status: 400 }
      );
    }
    
    // Usar dados do usuário do token
    const userData = payload.data as any;
    const newMessage = await ChatApiService.addMessage(
      userData.id || 'demo-user',
      text.trim(),
      {
        displayName: userData.displayName || 'Usuário Demo',
        photoURL: userData.photoURL || generateRealPersonAvatar(),
        isPro: userData.isPro || false
      }
    );
    
    // Formatar data para serialização
    const formattedMessage = {
      ...newMessage,
      createdAt: newMessage.createdAt.toISOString()
    };
    
    return NextResponse.json(formattedMessage, { status: 201 });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}