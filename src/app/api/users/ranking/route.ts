import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/api/prisma';
import { ScoringService } from '@/services/ScoringService';
import { RankingPeriod } from '@/lib/scoring';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const period = (searchParams.get('period') || 'all-time') as RankingPeriod;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');

    // Se especificar userId, retorna posição daquele usuário
    if (userId) {
      const userPosition = await ScoringService.getUserRankingPosition(userId, period);
      return NextResponse.json(userPosition);
    }

    // Buscar ranking completo com service
    const ranking = await ScoringService.getRanking(period, limit, offset);

    // Formato compatível com o frontend existente
    const formattedRanking = ranking.map(entry => ({
      id: entry.userId,
      username: entry.username,
      display_name: entry.displayName,
      pontuacaoTotal: entry.score,
      photo_url: entry.avatar,
      image: entry.avatar,
      level: entry.level,
      title: entry.title,
      position: entry.position,
      battleWins: entry.battleWins,
      totalPosts: entry.totalPosts
    }));

    return NextResponse.json({
      success: true,
      users: formattedRanking,
      period,
      total: formattedRanking.length
    });
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar ranking de usuários' },
      { status: 500 }
    );
  }
} 