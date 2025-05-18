import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/permissions';

// GET - Obter estatísticas de batalhas
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Buscar estatísticas do usuário
    const stats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        battleWins: true,
        totalBattles: true,
        currentStreak: true,
        bestStreak: true,
        lastBattle: true
      }
    });
    
    if (!stats) {
      return NextResponse.json({
        battleWins: 0,
        totalBattles: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastBattle: null,
        winRate: 0
      });
    }
    
    const winRate = stats.totalBattles > 0 
      ? Math.round((stats.battleWins / stats.totalBattles) * 100) 
      : 0;
    
    return NextResponse.json({
      ...stats,
      winRate
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}

// POST - Registrar voto em batalha
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { winnerPostId, loserPostId } = body;
    
    if (!winnerPostId || !loserPostId) {
      return NextResponse.json(
        { error: 'IDs dos posts são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Buscar os posts
    const [winnerPost, loserPost] = await Promise.all([
      prisma.post.findUnique({
        where: { id: winnerPostId },
        include: { author: true }
      }),
      prisma.post.findUnique({
        where: { id: loserPostId },
        include: { author: true }
      })
    ]);
    
    if (!winnerPost || !loserPost) {
      return NextResponse.json(
        { error: 'Posts não encontrados' },
        { status: 404 }
      );
    }
    
    // Atualizar estatísticas em uma transação
    await prisma.$transaction(async (tx) => {
      // Atualizar pontuação do post vencedor
      await tx.post.update({
        where: { id: winnerPostId },
        data: {
          battleScore: { increment: 1 }
        }
      });
      
      // Atualizar estatísticas do autor vencedor
      const winnerStats = await tx.user.findUnique({
        where: { id: winnerPost.authorId },
        select: {
          battleWins: true,
          currentStreak: true,
          bestStreak: true
        }
      });
      
      const newStreak = (winnerStats?.currentStreak || 0) + 1;
      const bestStreak = Math.max(newStreak, winnerStats?.bestStreak || 0);
      
      await tx.user.update({
        where: { id: winnerPost.authorId },
        data: {
          battleWins: { increment: 1 },
          currentStreak: newStreak,
          bestStreak: bestStreak
        }
      });
      
      // Resetar sequência do perdedor
      await tx.user.update({
        where: { id: loserPost.authorId },
        data: {
          currentStreak: 0
        }
      });
      
      // Atualizar estatísticas do votante
      await tx.user.update({
        where: { id: userId },
        data: {
          totalBattles: { increment: 1 },
          lastBattle: new Date()
        }
      });
      
      // Criar registro da batalha
      await tx.battle.create({
        data: {
          voterId: userId,
          winnerPostId,
          loserPostId,
          winnerAuthorId: winnerPost.authorId,
          loserAuthorId: loserPost.authorId
        }
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao registrar voto' },
      { status: 500 }
    );
  }
}

// GET - Obter histórico de batalhas
// Função auxiliar para obter histórico (não exportada diretamente)
async function getHistory(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    const battles = await prisma.battle.findMany({
      where: {
        OR: [
          { winnerAuthorId: userId },
          { loserAuthorId: userId }
        ]
      },
      include: {
        winnerPost: {
          include: { author: true }
        },
        loserPost: {
          include: { author: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    return NextResponse.json(battles);
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao buscar histórico' },
      { status: 500 }
    );
  }
}