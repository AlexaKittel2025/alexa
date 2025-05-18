import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';
import { FollowService } from '@/services/FollowService';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const followerId = session.user.id;
    const followingId = params.id;

    const result = await FollowService.followUser(followerId, followingId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao seguir usuário' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const followerId = session.user.id;
    const followingId = params.id;

    const result = await FollowService.unfollowUser(followerId, followingId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao deixar de seguir usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao deixar de seguir usuário' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id || '';
    const targetUserId = params.id;

    const status = await FollowService.checkFollowStatus(currentUserId, targetUserId);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Erro ao verificar status de follow:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar status' },
      { status: 500 }
    );
  }
}