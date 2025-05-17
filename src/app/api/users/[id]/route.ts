import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// Obter um usuário pelo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // Buscar o usuário pelo ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        posts: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            tags: {
              include: {
                tag: true
              }
            }
          }
        },
        stats: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Formatar para serialização segura
    const formattedUser = {
      ...user,
      password: undefined, // Remove a senha por segurança
      emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      posts: user.posts.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }))
    };
    
    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}

// Atualizar um usuário
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const userId = params.id;
    const body = await request.json();
    
    // Verificar se o usuário existe
    const existingUser = await db.select().from(users).where(eq(users.id, userId));
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Atualizar usuário
    const updatedUser = await db.update(users)
      .set({
        name: body.name !== undefined ? body.name : existingUser[0].name,
        email: body.email !== undefined ? body.email : existingUser[0].email,
        photoUrl: body.photoUrl !== undefined ? body.photoUrl : existingUser[0].photoUrl,
        bio: body.bio !== undefined ? body.bio : existingUser[0].bio,
        level: body.level !== undefined ? body.level : existingUser[0].level,
        score: body.score !== undefined ? body.score : existingUser[0].score,
        isOnline: body.isOnline !== undefined ? body.isOnline : existingUser[0].isOnline,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    
    // Verificar se é um erro de duplicidade de email
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao atualizar usuário',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Excluir um usuário
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const userId = params.id;
    
    // Verificar se o usuário existe
    const existingUser = await db.select().from(users).where(eq(users.id, userId));
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir usuário
    const deletedUser = await db.delete(users)
      .where(eq(users.id, userId))
      .returning();
    
    return NextResponse.json({
      message: 'Usuário excluído com sucesso',
      user: deletedUser[0]
    });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao excluir usuário',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 