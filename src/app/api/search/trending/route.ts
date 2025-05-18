import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/SearchService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') as 'day' | 'week' | 'month' || 'week';
    const limit = parseInt(searchParams.get('limit') || '10');

    const trending = await SearchService.getTrending({
      period,
      limit
    });

    return NextResponse.json({
      success: true,
      ...trending
    });
  } catch (error) {
    console.error('Erro ao buscar trending:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar trending',
        trendingTags: [],
        trendingUsers: [],
        trendingPosts: []
      },
      { status: 500 }
    );
  }
}