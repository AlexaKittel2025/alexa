import { prisma } from '@/lib/prisma';

// Funções para posts
export async function getPosts(limit = 10, lastPostTimestamp: Date | null = null) {
  const posts = await prisma.post.findMany({
    take: limit,
    where: lastPostTimestamp ? {
      createdAt: {
        lt: lastPostTimestamp
      }
    } : {},
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
  });

  return posts;
}

// Exportar db como alias para prisma (compatibilidade)
export const db = prisma;

// Função para testar a conexão com o banco
export async function testDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    return { success: false, message: 'Database connection failed', error };
  }
}

// Funções para usuários
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      username: true,
      isPro: true,
      points: true,
      createdAt: true,
      posts: {
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      followers: true,
      following: true
    }
  });
}

// Funções para tags
export async function getPopularTags(limit = 10) {
  const tagCounts = await prisma.postTag.groupBy({
    by: ['tagId'],
    _count: true,
    orderBy: {
      _count: {
        tagId: 'desc'
      }
    },
    take: limit
  });

  const tagIds = tagCounts.map(tag => tag.tagId);
  const tags = await prisma.tag.findMany({
    where: {
      id: {
        in: tagIds
      }
    }
  });

  return tags.map(tag => ({
    ...tag,
    count: tagCounts.find(tc => tc.tagId === tag.id)?._count || 0
  }));
}

// Funções para comentários
export async function getCommentsByPostId(postId: string) {
  return await prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

// Funções para reações
export async function toggleReaction(postId: string, userId: string, type: string) {
  const existingReaction = await prisma.reaction.findFirst({
    where: {
      postId,
      userId,
      type
    }
  });

  if (existingReaction) {
    // Remover reação existente
    await prisma.reaction.delete({
      where: { id: existingReaction.id }
    });
    return { action: 'removed' };
  } else {
    // Adicionar nova reação
    await prisma.reaction.create({
      data: {
        postId,
        userId,
        type
      }
    });
    return { action: 'added' };
  }
}

// Função para seguir/deixar de seguir usuários
export async function toggleFollow(followerId: string, followingId: string) {
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followingId
    }
  });

  if (existingFollow) {
    // Unfollow
    await prisma.follow.delete({
      where: { id: existingFollow.id }
    });
    return { following: false };
  } else {
    // Follow
    await prisma.follow.create({
      data: {
        followerId,
        followingId
      }
    });
    return { following: true };
  }
}