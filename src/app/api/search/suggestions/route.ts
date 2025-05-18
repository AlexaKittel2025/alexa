import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/SearchService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: []
      });
    }

    const suggestions = await SearchService.getSuggestions(query, limit);

    return NextResponse.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar sugestões',
        suggestions: []
      },
      { status: 500 }
    );
  }
}