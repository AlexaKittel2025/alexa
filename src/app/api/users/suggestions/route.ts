import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';
import { FollowService } from '@/services/FollowService';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '5');

    const suggestions = await FollowService.getSuggestions(session.user.id, limit);

    return NextResponse.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar sugestões' },
      { status: 500 }
    );
  }
}