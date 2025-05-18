import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PostApiService } from '@/services/PostApiService';

// GET - Obter posts (com paginação e filtros)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const cursor = searchParams.get('cursor');
    const tag = searchParams.get('tag') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const search = searchParams.get('search') || undefined;
    
    // Se houver busca, pesquisar posts
    if (search) {
      const posts = await PostApiService.searchPosts(search);
      return NextResponse.json({ posts });
    }
    
    // Senão, listar posts com filtros
    const posts = await PostApiService.getPostsWithFilters({
      limit,
      cursor: cursor || undefined,
      tag,
      userId
    });
    
    const response = NextResponse.json(posts);
    
    // Adicionar cache headers para melhor performance
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
    
    // Retornar array vazio em vez de erro para evitar quebrar o frontend
    return NextResponse.json({ posts: [] });
  }
}

// POST - Criar novo post
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verificar autenticação
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const body = await req.json();
    const { title, content, imageUrl, tags } = body;
    
    const post = await PostApiService.createPost({
      title,
      content,
      imageUrl,
      tags,
      authorId: userId
    });
    
    return NextResponse.json(post);
  } catch (error) {

    // Verificar se é erro de validação
    if (error instanceof Error && error.message.includes('obrigatórios')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar post' },
      { status: 500 }
    );
  }
}