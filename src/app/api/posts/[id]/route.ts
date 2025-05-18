import { NextResponse, NextRequest } from 'next/server';
import { PostApiService } from '@/services/PostApiService';
import { getUserPermissions, requireAuth, canEditResource, canDeleteResource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Obter um post específico
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            username: true,
            image: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                display_name: true,
                username: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reactions: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao buscar post' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUserId = await requireAuth(request);
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Buscar o post para verificar o dono
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar permissões
    const canEdit = await canEditResource(request, post.authorId);
    if (!canEdit) {
      return NextResponse.json(
        { error: 'Sem permissão para editar este post' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl
      },
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            username: true,
            image: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao atualizar post' },
      { status: 500 }
    );
  }
}

// DELETE - Remover um post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUserId = await requireAuth(request);
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Buscar o post para verificar o dono
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar permissões
    const canDelete = await canDeleteResource(request, post.authorId);
    if (!canDelete) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar este post' },
        { status: 403 }
      );
    }
    
    await prisma.post.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Erro ao remover post' },
      { status: 500 }
    );
  }
}