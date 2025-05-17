import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  try {
    // Obter parâmetros de consulta
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Buscar usuários com paginação
    const result = await db.select().from(users).limit(limit).offset(offset);
    
    // Contar o total de usuários
    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(users);
    
    const total = Number(countResult[0]?.count || 0);
    
    return NextResponse.json({
      users: result,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar usuários',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar campos obrigatórios
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Os campos nome e email são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Inserir usuário
    const newUser = await db.insert(users).values({
      name: body.name,
      email: body.email,
      photoUrl: body.photoUrl,
      bio: body.bio
    }).returning();
    
    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    // Verificar se é um erro de duplicidade de email
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao criar usuário',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 