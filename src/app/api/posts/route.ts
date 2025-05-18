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
    
    // Verificar se o usuário está autenticado (permite posts anônimos)
    const userId = session?.user?.id || 'anonymous';
    
    // Verificar se é FormData (upload de arquivo) ou JSON
    const contentType = req.headers.get('content-type');
    let title, content, imageUrl, tags;
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      content = formData.get('content') as string;
      tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [];
      
      // Se houver arquivo, fazer upload
      const file = formData.get('image') as File;
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload`, {
          method: 'POST',
          body: uploadFormData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }
      }
      
      title = content.substring(0, 50); // Título como primeira parte do conteúdo
    } else {
      const body = await req.json();
      ({ title, content, imageUrl, tags } = body);
    }
    
    const post = await PostApiService.createPost({
      title: title || content.substring(0, 50),
      content,
      imageUrl,
      tags,
      authorId: userId
    });
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    
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