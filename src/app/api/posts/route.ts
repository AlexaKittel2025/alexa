import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET - Obter posts (com paginação e filtros)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const cursor = searchParams.get('cursor'); // ID do último post para paginação
    const tag = searchParams.get('tag');
    const userId = searchParams.get('userId');
    
    // Construir o query base
    const queryOptions: any = {
      take: limit,
      orderBy: {
        createdAt: 'desc' as const
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        comments: true,
        reactions: true,
        tags: {
          include: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      }
    };
    
    // Adicionar cursor para paginação se fornecido
    if (cursor) {
      queryOptions.skip = 1; // Pular o post atual do cursor
      queryOptions.cursor = {
        id: cursor
      };
    }
    
    // Filtros adicionais
    const where: any = {};
    
    // Filtrar por tag
    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag
          }
        }
      };
    }
    
    // Filtrar por usuário
    if (userId) {
      where.authorId = userId;
    }
    
    // Adicionar filtros ao query
    if (Object.keys(where).length > 0) {
      queryOptions.where = where;
    }
    
    console.log('Consultando posts com as seguintes opções:', JSON.stringify(queryOptions, null, 2));
    
    // Usar dados de demo em caso de erro ao consultar o banco
    let posts;
    try {
      // Executar a consulta
      posts = await prisma.post.findMany(queryOptions);
    } catch (dbError) {
      console.error('Erro ao consultar o banco de dados:', dbError);
      
      // Retornar array vazio em vez de erro para evitar quebrar o frontend
      return NextResponse.json([]);
    }
    
    // Formatar os dados para serem seguros para serialização JSON
    const formattedPosts = posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Erro geral ao obter posts:', error);
    return NextResponse.json(
      [], // Retornar array vazio em vez de erro
      { status: 200 } // Usar status 200 para evitar erros no cliente
    );
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
    
    // Validação básica
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Criar o post
    let post;
    try {
      post = await prisma.post.create({
        data: {
          title,
          content,
          imageUrl,
          authorId: userId
        }
      });
    } catch (dbError) {
      console.error('Erro ao criar post no banco de dados:', dbError);
      return NextResponse.json(
        { error: 'Erro ao criar post no banco de dados' },
        { status: 500 }
      );
    }
    
    // Adicionar tags se fornecidas
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        try {
          // Verificar se a tag já existe
          let tag = await prisma.tag.findUnique({
            where: { name: tagName }
          });
          
          // Se não existir, criar
          if (!tag) {
            tag = await prisma.tag.create({
              data: { name: tagName }
            });
          } else {
            // Incrementar contador de uso
            await prisma.tag.update({
              where: { id: tag.id },
              data: {
                useCount: { increment: 1 }
              }
            });
          }
          
          // Criar relação entre post e tag
          await prisma.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id
            }
          });
        } catch (tagError) {
          console.error(`Erro ao processar tag "${tagName}":`, tagError);
          // Continuar com as próximas tags mesmo se houver erro
        }
      }
    }
    
    // Incluir informações adicionais na resposta
    let postWithDetails;
    try {
      postWithDetails = await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
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
    } catch (detailsError) {
      console.error('Erro ao obter detalhes do post:', detailsError);
      // Retornar o post básico se não conseguir obter os detalhes
      return NextResponse.json({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      });
    }
    
    // Formatar para JSON seguro
    const formattedPost = {
      ...postWithDetails,
      createdAt: postWithDetails?.createdAt.toISOString(),
      updatedAt: postWithDetails?.updatedAt.toISOString(),
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Erro geral ao criar post:', error);
    return NextResponse.json(
      { error: 'Erro ao criar post' },
      { status: 500 }
    );
  }
}
