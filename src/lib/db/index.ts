/**
 * Este arquivo serve como uma camada de compatibilidade para adaptar o código
 * que anteriormente usava Firestore para usar o Prisma.
 * 
 * Ele exporta funções que fazem operações de banco de dados usando Prisma
 * mas mantém a mesma interface que era esperada pelo código original.
 */

import { prisma } from '@/lib/prisma';
import { ExtendedPost, ExtendedUser } from '@/types/prisma';

// Funções para posts
export async function getPosts(limit: number = 10, lastPostId: string | null = null) {
  const options: any = {
    take: limit,
    orderBy: {
      createdAt: 'desc'
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

  // Se tiver um último ID para paginação
  if (lastPostId) {
    options.cursor = { id: lastPostId };
    options.skip = 1; // Pular o último que já vimos
  }

  return await prisma.post.findMany(options);
}

// Obter posts por tag
export async function getPostsByTag(tag: string, limit: number = 10, lastPostId: string | null = null) {
  const options: any = {
    take: limit,
    where: {
      tags: {
        some: {
          tag: {
            name: tag
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
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

  // Se tiver um último ID para paginação
  if (lastPostId) {
    options.cursor = { id: lastPostId };
    options.skip = 1;
  }

  return await prisma.post.findMany(options);
}

// Obter posts por usuário
export async function getPostsByUser(userId: string, limit: number = 10, lastPostId: string | null = null) {
  const options: any = {
    take: limit,
    where: {
      authorId: userId
    },
    orderBy: {
      createdAt: 'desc'
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

  // Se tiver um último ID para paginação
  if (lastPostId) {
    options.cursor = { id: lastPostId };
    options.skip = 1;
  }

  return await prisma.post.findMany(options);
}

// Obter usuário por ID
export async function getUserById(userId: string): Promise<ExtendedUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        take: 5,
        orderBy: { createdAt: 'desc' },
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

  if (!user) return null;

  // Converter para o formato esperado pelo front-end
  return {
    ...user,
    uid: user.id, // Campo de compatibilidade
    displayName: user.name, // Campo de compatibilidade
    photoURL: user.image // Campo de compatibilidade
  };
}

// Obter usuários com maior pontuação
export async function getTopUsers(limit: number = 10) {
  return await prisma.user.findMany({
    take: limit,
    orderBy: {
      score: 'desc'
    },
    select: {
      id: true,
      name: true,
      image: true,
      score: true
    }
  });
}

// Atualizar pontos de um usuário
export async function updateUserPoints(userId: string, points: number) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      score: { increment: points }
    }
  });
}

// Obter tags populares
export async function getPopularTags(limit: number = 20) {
  const tags = await prisma.tag.findMany({
    take: limit,
    orderBy: {
      useCount: 'desc'
    }
  });

  return tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    count: tag.useCount
  }));
}

// Função de compatibilidade para adaptar o formato dos dados
export function adaptFirestoreData<T>(data: T): T {
  return data;
} 