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

export async function getPostsByTag(tag: string, limit = 10, lastPostTimestamp: Date | null = null) {
  const posts = await prisma.post.findMany({
    take: limit,
    where: {
      tags: {
        some: {
          tag: {
            name: tag
          }
        }
      },
      ...(lastPostTimestamp ? {
        createdAt: {
          lt: lastPostTimestamp
        }
      } : {})
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
  });
  
  return posts;
}

export async function getPostsByUser(userId: string, limit = 10, lastPostTimestamp: Date | null = null) {
  const posts = await prisma.post.findMany({
    take: limit,
    where: {
      authorId: userId,
      ...(lastPostTimestamp ? {
        createdAt: {
          lt: lastPostTimestamp
        }
      } : {})
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
  });
  
  return posts;
}

export async function createPost(data: any) {
  const post = await prisma.post.create({
    data: {
      ...data,
      createdAt: new Date()
    },
    include: {
      author: true,
      comments: true,
      reactions: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
  
  return post;
}

// Funções para usuários
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      accounts: true,
      posts: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      }
    }
  });
  
  return user;
}

export async function getTopUsers(limit = 10) {
  const users = await prisma.user.findMany({
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
  
  return users;
}

export async function updateUserPoints(userId: string, points: number) {
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      score: {
        increment: points
      }
    }
  });
  
  return user;
}

// Funções para tags
export async function getPopularTags(limit = 20) {
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