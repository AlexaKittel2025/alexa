import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SearchResult {
  users: UserSearchResult[];
  posts: PostSearchResult[];
  tags: TagSearchResult[];
  totalResults: number;
}

export interface UserSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  level: number;
  score: number;
  isVerified?: boolean;
  isPro?: boolean;
  followersCount?: number;
  postsCount?: number;
}

export interface PostSearchResult {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  tags: string[];
  reactions: number;
  comments: number;
  createdAt: Date;
  score: number;
}

export interface TagSearchResult {
  id: string;
  name: string;
  useCount: number;
  trendingScore?: number;
}

export class SearchService {
  // Busca unificada
  static async search(query: string, options?: {
    limit?: number;
    offset?: number;
    type?: 'all' | 'users' | 'posts' | 'tags';
    sortBy?: 'relevance' | 'recent' | 'popular';
  }): Promise<SearchResult> {
    const {
      limit = 10,
      offset = 0,
      type = 'all',
      sortBy = 'relevance'
    } = options || {};

    const searchTerm = query.toLowerCase().trim();
    
    // Se a query estiver vazia, retornar resultados vazios
    if (!searchTerm) {
      return {
        users: [],
        posts: [],
        tags: [],
        totalResults: 0
      };
    }

    let users: UserSearchResult[] = [];
    let posts: PostSearchResult[] = [];
    let tags: TagSearchResult[] = [];

    // Buscar usuários
    if (type === 'all' || type === 'users') {
      users = await this.searchUsers(searchTerm, { limit, offset, sortBy });
    }

    // Buscar posts
    if (type === 'all' || type === 'posts') {
      posts = await this.searchPosts(searchTerm, { limit, offset, sortBy });
    }

    // Buscar tags
    if (type === 'all' || type === 'tags') {
      tags = await this.searchTags(searchTerm, { limit, offset });
    }

    const totalResults = users.length + posts.length + tags.length;

    return {
      users,
      posts,
      tags,
      totalResults
    };
  }

  // Buscar usuários
  static async searchUsers(query: string, options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'relevance' | 'recent' | 'popular';
  }): Promise<UserSearchResult[]> {
    const { limit = 10, offset = 0, sortBy = 'relevance' } = options || {};
    
    try {
      // Construir condições de busca
      const whereConditions = {
        OR: [
          { username: { contains: query, mode: 'insensitive' as const } },
          { display_name: { contains: query, mode: 'insensitive' as const } },
          { bio: { contains: query, mode: 'insensitive' as const } }
        ]
      };

      // Determinar ordenação
      let orderBy: any = {};
      switch (sortBy) {
        case 'recent':
          orderBy = { createdAt: 'desc' };
          break;
        case 'popular':
          orderBy = { pontuacaoTotal: 'desc' };
          break;
        case 'relevance':
        default:
          // Para relevância, ordenar por pontuação e depois por data
          orderBy = [
            { pontuacaoTotal: 'desc' },
            { createdAt: 'desc' }
          ];
      }

      const users = await prisma.user.findMany({
        where: whereConditions,
        include: {
          _count: {
            select: {
              posts: true,
              followers: true
            }
          }
        },
        orderBy,
        take: limit,
        skip: offset
      });

      // Formatar resultados
      return users.map(user => ({
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar || user.image,
        bio: user.bio,
        level: user.level || 1,
        score: user.pontuacaoTotal || 0,
        isPro: user.isPro,
        followersCount: user._count.followers || 0,
        postsCount: user._count.posts
      }));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }

  // Buscar posts
  static async searchPosts(query: string, options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'relevance' | 'recent' | 'popular';
    authorId?: string;
    tagId?: string;
  }): Promise<PostSearchResult[]> {
    const { 
      limit = 10, 
      offset = 0, 
      sortBy = 'relevance',
      authorId,
      tagId
    } = options || {};
    
    try {
      // Construir condições de busca
      const whereConditions: any = {
        isActive: true,
        AND: []
      };

      // Busca por texto
      if (query) {
        whereConditions.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ];
      }

      // Filtro por autor
      if (authorId) {
        whereConditions.AND.push({ authorId });
      }

      // Filtro por tag
      if (tagId) {
        whereConditions.AND.push({
          tags: {
            some: { tagId }
          }
        });
      }

      // Se não houver filtros AND, remover
      if (whereConditions.AND.length === 0) {
        delete whereConditions.AND;
      }

      // Determinar ordenação
      let orderBy: any = {};
      switch (sortBy) {
        case 'recent':
          orderBy = { createdAt: 'desc' };
          break;
        case 'popular':
          orderBy = { views: 'desc' };
          break;
        case 'relevance':
        default:
          orderBy = [
            { battleScore: 'desc' },
            { views: 'desc' },
            { createdAt: 'desc' }
          ];
      }

      const posts = await prisma.post.findMany({
        where: whereConditions,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              display_name: true,
              avatar: true,
              image: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              reactions: true,
              comments: true
            }
          }
        },
        orderBy,
        take: limit,
        skip: offset
      });

      // Formatar resultados
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        authorId: post.authorId,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.display_name,
          avatar: post.author.avatar || post.author.image
        },
        tags: post.tags.map(pt => pt.tag.name),
        reactions: post._count.reactions,
        comments: post._count.comments,
        createdAt: post.createdAt,
        score: post.battleScore || 0
      }));
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return [];
    }
  }

  // Buscar tags
  static async searchTags(query: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<TagSearchResult[]> {
    const { limit = 10, offset = 0 } = options || {};
    
    try {
      const tags = await prisma.tag.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        orderBy: {
          useCount: 'desc'
        },
        take: limit,
        skip: offset
      });

      // Calcular trending score baseado em uso recente
      const tagsWithTrending = await Promise.all(tags.map(async (tag) => {
        // Contar posts recentes com esta tag (últimos 7 dias)
        const recentPosts = await prisma.postTag.count({
          where: {
            tagId: tag.id,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        });

        const trendingScore = (recentPosts * 10) + (tag.useCount * 0.1);

        return {
          id: tag.id,
          name: tag.name,
          useCount: tag.useCount,
          trendingScore
        };
      }));

      // Ordenar por trending score
      return tagsWithTrending.sort((a, b) => b.trendingScore - a.trendingScore);
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      return [];
    }
  }

  // Sugestões de busca
  static async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query || query.length < 2) return [];

    try {
      const suggestions = new Set<string>();

      // Buscar usernames
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { startsWith: query, mode: 'insensitive' } },
            { display_name: { startsWith: query, mode: 'insensitive' } }
          ]
        },
        select: {
          username: true,
          display_name: true
        },
        take: limit
      });

      users.forEach(user => {
        suggestions.add(user.username);
        if (user.display_name) suggestions.add(user.display_name);
      });

      // Buscar tags
      const tags = await prisma.tag.findMany({
        where: {
          name: { startsWith: query, mode: 'insensitive' }
        },
        select: { name: true },
        take: limit
      });

      tags.forEach(tag => suggestions.add(tag.name));

      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      return [];
    }
  }

  // Busca em trending
  static async getTrending(options?: {
    limit?: number;
    period?: 'day' | 'week' | 'month';
  }): Promise<{
    trendingTags: TagSearchResult[];
    trendingUsers: UserSearchResult[];
    trendingPosts: PostSearchResult[];
  }> {
    const { limit = 10, period = 'week' } = options || {};

    // Calcular data de início baseada no período
    const startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    try {
      // Tags em trending
      const trendingTags = await prisma.tag.findMany({
        where: {
          posts: {
            some: {
              createdAt: {
                gte: startDate
              }
            }
          }
        },
        include: {
          _count: {
            select: {
              posts: {
                where: {
                  createdAt: {
                    gte: startDate
                  }
                }
              }
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: limit
      });

      // Usuários em trending (mais pontos no período)
      const trendingUsers = await prisma.user.findMany({
        where: {
          posts: {
            some: {
              createdAt: {
                gte: startDate
              }
            }
          }
        },
        include: {
          _count: {
            select: {
              posts: {
                where: {
                  createdAt: {
                    gte: startDate
                  }
                }
              }
            }
          }
        },
        orderBy: {
          pontuacaoTotal: 'desc'
        },
        take: limit
      });

      // Posts em trending (mais reações/views no período)
      const trendingPosts = await prisma.post.findMany({
        where: {
          createdAt: {
            gte: startDate
          },
          isActive: true
        },
        include: {
          author: true,
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              reactions: true,
              comments: true
            }
          }
        },
        orderBy: [
          { views: 'desc' },
          { reactions: { _count: 'desc' } }
        ],
        take: limit
      });

      return {
        trendingTags: trendingTags.map(tag => ({
          id: tag.id,
          name: tag.name,
          useCount: tag.useCount,
          trendingScore: tag._count.posts * 10
        })),
        trendingUsers: trendingUsers.map(user => ({
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          avatar: user.avatar || user.image,
          bio: user.bio,
          level: user.level || 1,
          score: user.pontuacaoTotal || 0,
          isPro: user.isPro,
          postsCount: user._count.posts
        })),
        trendingPosts: trendingPosts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          authorId: post.authorId,
          author: {
            id: post.author.id,
            username: post.author.username,
            displayName: post.author.display_name,
            avatar: post.author.avatar || post.author.image
          },
          tags: post.tags.map(pt => pt.tag.name),
          reactions: post._count.reactions,
          comments: post._count.comments,
          createdAt: post.createdAt,
          score: post.battleScore || 0
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar trending:', error);
      return {
        trendingTags: [],
        trendingUsers: [],
        trendingPosts: []
      };
    }
  }
}