import { NextResponse } from 'next/server';
import { UserDetailsService } from '@/services/UserDetailsService';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Obter um usuário pelo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await UserDetailsService.getUserWithDetails(params.id);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    
    if (error instanceof Error && error.message === 'Usuário não encontrado') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um usuário
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    
    const updatedUser = await UserDetailsService.updateUser(params.id, {
      name: body.name,
      email: body.email,
      photoUrl: body.photoUrl,
      bio: body.bio,
      level: body.level,
      isPro: body.isPro
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Usuário não encontrado') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'Email já está em uso' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}

// DELETE - Remover um usuário
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const result = await UserDetailsService.deleteUser(params.id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    
    if (error instanceof Error && error.message === 'Usuário não encontrado') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao remover usuário' },
      { status: 500 }
    );
  }
}