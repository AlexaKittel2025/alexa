import { NextResponse } from 'next/server';
import { prisma } from '@/api/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        display_name: true,
        pontuacaoTotal: true,
        image: true,
      },
      orderBy: {
        pontuacaoTotal: 'desc',
      },
      take: 10,
    });

    const formattedUsers = users.map(user => ({
      ...user,
      photo_url: user.image,
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar ranking de usuários' },
      { status: 500 }
    );
  }
} 