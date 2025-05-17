import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface PostFilters {
  limit?: number;
  cursor?: string;
  tag?: string;
  userId?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  authorId: string;
}

export class PostApiService {
  // Obter posts com filtros e paginação
  static async getPostsWithFilters(filters: PostFilters) {
    const { limit = 10, cursor, tag, userId } = filters;
    
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
      queryOptions.skip = 1;
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
    
    // Executar a consulta
    const posts = await prisma.post.findMany(queryOptions);
    
    // Formatar os dados para serem seguros para serialização JSON
    return posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
  }
  
  // Criar novo post
  static async createPost(data: CreatePostData) {
    const { title, content, imageUrl, tags, authorId } = data;
    
    // Validação básica
    if (!title || !content) {
      throw new Error('Título e conteúdo são obrigatórios');
    }
    
    // Criar o post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        authorId
      }
    });
    
    // Adicionar tags se fornecidas
    if (tags && Array.isArray(tags) && tags.length > 0) {
      await this.processTags(post.id, tags);
    }
    
    // Retornar post com detalhes
    return this.getPostWithDetails(post.id);
  }
  
  // Processar tags para um post
  private static async processTags(postId: string, tags: string[]) {
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
            postId,
            tagId: tag.id
          }
        });
      } catch (tagError) {
        console.error(`Erro ao processar tag "${tagName}":`, tagError);
        // Continuar com as próximas tags mesmo se houver erro
      }
    }
  }
  
  // Obter post com detalhes completos
  private static async getPostWithDetails(postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
    
    if (!post) {
      throw new Error('Post não encontrado');
    }
    
    // Formatar para JSON seguro
    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}