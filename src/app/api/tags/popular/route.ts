import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let tags = [];
    
    try {
      // Buscar tags populares ordenadas por quantidade de uso
      tags = await prisma.tag.findMany({
        take: limit,
        orderBy: {
          useCount: 'desc'
        }
      });
    } catch (dbError) {
      console.error('Erro ao consultar tags no banco de dados:', dbError);
      // Retornar dados de fallback
      return NextResponse.json(
        ['alien', 'ex', 'vida rica', 'trabalho', 'família', 'viagem'].map((tag, index) => ({
          id: `tag-${index}`,
          name: tag,
          count: Math.floor(Math.random() * 100) + 20
        }))
      );
    }
    
    // Formatar tags para resposta
    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      count: tag.useCount
    }));
    
    return NextResponse.json(formattedTags);
  } catch (error) {
    console.error('Erro geral ao buscar tags populares:', error);
    // Retornar dados de fallback para não quebrar o frontend
    return NextResponse.json(
      ['alien', 'ex', 'vida rica', 'trabalho', 'família', 'viagem'].map((tag, index) => ({
        id: `tag-${index}`,
        name: tag,
        count: Math.floor(Math.random() * 100) + 20
      })),
      { status: 200 }
    );
  }
} 