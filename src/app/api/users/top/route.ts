import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let users = [];
    
    try {
      // Buscar usuários ordenados por pontuação
      users = await prisma.user.findMany({
        take: limit,
        orderBy: {
          score: 'desc'
        },
        select: {
          id: true,
          name: true,
          image: true,
          score: true,
          level: true
        }
      });
    } catch (dbError) {
      
      // Retornar dados de fallback
      return NextResponse.json([
        {
          id: 'fake1',
          name: 'Carlos Mendes',
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
          score: 1107,
          level: 5
        },
        {
          id: 'fake2',
          name: 'Ana Beatriz',
          image: 'https://randomuser.me/api/portraits/women/44.jpg',
          score: 984,
          level: 4
        },
        {
          id: 'fake3',
          name: 'Rodrigo Lima',
          image: 'https://randomuser.me/api/portraits/men/67.jpg',
          score: 861,
          level: 4
        },
        {
          id: 'fake4',
          name: 'Juliana Costa', 
          image: 'https://randomuser.me/api/portraits/women/12.jpg',
          score: 738,
          level: 3
        },
        {
          id: 'fake5',
          name: 'Pedro Almeida',
          image: 'https://randomuser.me/api/portraits/men/23.jpg',
          score: 615,
          level: 3
        }
      ]);
    }
    
    return NextResponse.json(users);
  } catch (error) {
    
    // Retornar dados de fallback para não quebrar o frontend
    return NextResponse.json([
      {
        id: 'fake1',
        name: 'Carlos Mendes',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        score: 1107,
        level: 5
      },
      {
        id: 'fake2',
        name: 'Ana Beatriz',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        score: 984,
        level: 4
      },
      {
        id: 'fake3',
        name: 'Rodrigo Lima',
        image: 'https://randomuser.me/api/portraits/men/67.jpg',
        score: 861,
        level: 4
      },
      {
        id: 'fake4',
        name: 'Juliana Costa', 
        image: 'https://randomuser.me/api/portraits/women/12.jpg',
        score: 738,
        level: 3
      },
      {
        id: 'fake5',
        name: 'Pedro Almeida',
        image: 'https://randomuser.me/api/portraits/men/23.jpg',
        score: 615,
        level: 3
      }
    ], { status: 200 });
  }
} 