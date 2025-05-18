import { NextResponse, NextRequest } from 'next/server';
import { GlobalChatService } from '@/services/GlobalChatService';

// GET - Obter estatísticas do chat
export async function GET(request: NextRequest) {
  try {
    const stats = await GlobalChatService.getChatStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}