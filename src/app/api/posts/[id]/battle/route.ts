import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/permissions';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST - Incrementar vitória em batalha
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getCurrentUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Buscar o post
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: true }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }
    
    // Atualizar pontuação de batalha
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        battleScore: { increment: 1 }
      }
    });
    
    // Atualizar estatísticas do autor
    if (post.authorId) {
      await prisma.user.update({
        where: { id: post.authorId },
        data: {
          battleWins: { increment: 1 }
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      battleScore: updatedPost.battleScore
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao atualizar pontuação' },
      { status: 500 }
    );
  }
}