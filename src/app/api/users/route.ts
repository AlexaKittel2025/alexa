import { NextResponse } from 'next/server';
import { UserApiService } from '@/services/UserApiService';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';
    
    // Se houver busca, pesquisar usuários
    if (search) {
      const users = await UserApiService.searchUsers(search);
      return NextResponse.json({ users });
    }
    
    // Senão, listar todos com paginação
    const result = await UserApiService.getUsersWithPagination({
      limit,
      offset
    });
    
    return NextResponse.json(result);
  } catch (error) {

    return NextResponse.json(
      { 
        error: 'Erro ao buscar usuários',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newUser = await UserApiService.createUser({
      name: body.name,
      email: body.email,
      photoUrl: body.photoUrl,
      bio: body.bio
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {

    if (error instanceof Error) {
      if (error.message.includes('obrigatórios')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      if (error.message === 'Email já cadastrado') {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao criar usuário',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}