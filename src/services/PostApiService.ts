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
  // Buscar posts por termo de busca
  static async searchPosts(searchTerm: string) {
    try {
      // Mock data por enquanto
      const mockPosts = [
        {
          id: '1',
          user: {
            id: '1',
            name: 'João Silva',
            username: 'joaosilva',
            avatar: '/images/avatar-placeholder.jpg'
          },
          content: `Hoje vi um unicórnio no estacionamento do shopping. Ele estava comendo batata frita e ouvindo música clássica. #mentira #criatividade`,
          likes: 42,
          comments: 5,
          createdAt: new Date().toISOString(),
          likedByMe: false,
          saved: false,
          imageUrl: '',
          truth_percentage: 5,
          tags: ['mentira', 'criatividade']
        },
        {
          id: '2',
          user: {
            id: '2',
            name: 'Maria Santos',
            username: 'mariasantos',
            avatar: '/images/avatar-placeholder.jpg'
          },
          content: `Minha avó surfou pela primeira vez aos 95 anos e ganhou o campeonato mundial. #mentira #humor`,
          likes: 87,
          comments: 12,
          createdAt: new Date().toISOString(),
          likedByMe: false,
          saved: false,
          imageUrl: '',
          truth_percentage: 2,
          tags: ['mentira', 'humor']
        }
      ];
      
      // Filtrar posts que contenham o termo de busca
      const filteredPosts = mockPosts.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      return filteredPosts;
    } catch (error) {
      
      return [];
    }
  }
  
  // Obter posts com filtros e paginação
  static async getPostsWithFilters(filters: PostFilters) {
    const { limit = 10, cursor, tag, userId } = filters;
    
    // Construir o where clause
    const where: any = {};
    
    // Filtrar por usuário se fornecido
    if (userId) {
      where.authorId = userId;
    }
    
    // Filtrar por tag se fornecido
    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag
          }
        }
      };
    }
    
    // Construir o query base
    const queryOptions: any = {
      where,
      take: limit,
      orderBy: {
        createdAt: 'desc' as const
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