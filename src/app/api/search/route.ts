import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/SearchService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') as 'all' | 'users' | 'posts' | 'tags' || 'all';
    const sortBy = searchParams.get('sortBy') as 'relevance' | 'recent' | 'popular' || 'relevance';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const results = await SearchService.search(query, {
      type,
      sortBy,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao realizar busca',
        users: [],
        posts: [],
        tags: [],
        totalResults: 0
      },
      { status: 500 }
    );
  }
}