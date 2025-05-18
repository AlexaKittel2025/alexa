import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    
    if (search) {
      // Buscar tags que contenham o termo de busca
      const tags = await prisma.tag.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
          ]
        },
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 10
      });
      
      const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        count: tag._count.posts
      }));
      
      return NextResponse.json({ tags: formattedTags });
    }
    
    // Se não houver busca, retornar tags populares
    const popularTags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      },
      take: 10
    });
    
    const formattedTags = popularTags.map(tag => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.posts
    }));
    
    return NextResponse.json({ tags: formattedTags });
  } catch (error) {

    // Retornar dados mock em caso de erro
    const mockTags = [
      { id: '1', name: 'mentira', count: 150 },
      { id: '2', name: 'criatividade', count: 120 },
      { id: '3', name: 'humor', count: 100 },
      { id: '4', name: 'ficção', count: 80 },
      { id: '5', name: 'história', count: 75 }
    ];
    
    return NextResponse.json({ tags: mockTags });
  }
}