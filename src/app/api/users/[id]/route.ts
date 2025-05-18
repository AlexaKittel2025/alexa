import { NextResponse, NextRequest } from 'next/server';
import { UserDetailsService } from '@/services/UserDetailsService';
import { getUserPermissions, requireAuth, canEditResource, canDeleteResource } from '@/lib/permissions';

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
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const currentUserId = await requireAuth(request);
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar permissões
    const canEdit = await canEditResource(request, params.id);
    if (!canEdit) {
      return NextResponse.json(
        { error: 'Sem permissão para editar este perfil' },
        { status: 403 }
      );
    }
    
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
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const currentUserId = await requireAuth(request);
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar permissões
    const canDelete = await canDeleteResource(request, params.id);
    if (!canDelete) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar este perfil' },
        { status: 403 }
      );
    }
    
    const result = await UserDetailsService.deleteUser(params.id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {

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