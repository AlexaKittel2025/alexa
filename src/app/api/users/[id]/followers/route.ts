import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';
import { FollowService } from '@/services/FollowService';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = req.nextUrl.searchParams;
    
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const currentUserId = session?.user?.id;

    const followers = await FollowService.getFollowers(params.id, {
      limit,
      offset,
      currentUserId
    });

    return NextResponse.json({
      success: true,
      followers,
      total: followers.length
    });
  } catch (error) {
    console.error('Erro ao buscar seguidores:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar seguidores' },
      { status: 500 }
    );
  }
}