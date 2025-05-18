import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { BattleService } from '@/services/BattleService';

// POST - Votar em uma batalha
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
    const { battleId, postId } = body;
    
    if (!battleId || !postId) {
      return NextResponse.json(
        { error: 'ID da batalha e do post são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se o usuário pode votar
    const canVote = await BattleService.canUserVote(session.user.id, battleId);
    if (!canVote) {
      return NextResponse.json(
        { error: 'Você já votou nesta batalha' },
        { status: 400 }
      );
    }
    
    // Registrar voto
    const battle = await BattleService.voteInBattle(
      session.user.id,
      battleId,
      postId
    );
    
    return NextResponse.json(battle);
  } catch (error) {
    console.error('Erro ao votar:', error);
    return NextResponse.json(
      { error: 'Erro ao processar voto' },
      { status: 500 }
    );
  }
}

// GET - Verificar se usuário pode votar
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
    const battleId = searchParams.get('battleId');
    
    if (!battleId) {
      return NextResponse.json(
        { error: 'ID da batalha é obrigatório' },
        { status: 400 }
      );
    }
    
    const canVote = await BattleService.canUserVote(session.user.id, battleId);
    
    return NextResponse.json({ canVote });
  } catch (error) {
    console.error('Erro ao verificar voto:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar voto' },
      { status: 500 }
    );
  }
}