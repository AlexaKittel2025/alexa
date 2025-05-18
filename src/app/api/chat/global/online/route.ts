import { NextResponse, NextRequest } from 'next/server';
import { GlobalChatService } from '@/services/GlobalChatService';

// GET - Obter usuários online
export async function GET(request: NextRequest) {
  try {
    const onlineUsers = await GlobalChatService.getOnlineUsers();
    
    return NextResponse.json(onlineUsers);
  } catch (error) {
    console.error('Erro ao buscar usuários online:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários online' },
      { status: 500 }
    );
  }
}