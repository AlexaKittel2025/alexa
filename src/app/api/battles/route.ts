import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { BattleService } from '@/services/BattleService';

// GET - Obter informações de batalhas
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
    const type = searchParams.get('type');
    
    // Obter batalha ativa
    if (type === 'active') {
      const activeBattle = await BattleService.getActiveBattle();
      return NextResponse.json(activeBattle);
    }
    
    // Obter histórico de batalhas
    if (type === 'history') {
      const history = await BattleService.getUserBattleHistory(session.user.id);
      return NextResponse.json(history);
    }
    
    // Obter estatísticas do usuário (padrão)
    const stats = await BattleService.getUserBattleStats(session.user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar dados de batalhas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de batalhas' },
      { status: 500 }
    );
  }
}

// POST - Criar ou entrar em batalha
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
    const { action, content, imageUrl } = body;
    
    // Criar ou entrar em batalha
    if (action === 'create' || action === 'join') {
      if (!content) {
        return NextResponse.json(
          { error: 'Conteúdo é obrigatório' },
          { status: 400 }
        );
      }
      
      const battle = await BattleService.createOrJoinBattle(
        session.user.id,
        content,
        imageUrl
      );
      
      return NextResponse.json(battle);
    }
    
    return NextResponse.json(
      { error: 'Ação inválida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erro ao processar batalha:', error);
    return NextResponse.json(
      { error: 'Erro ao processar batalha' },
      { status: 500 }
    );
  }
}

