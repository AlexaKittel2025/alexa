import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';

// Usuários mock com senhas em texto simples
const mockUsers = {
  'teste@mentei.com': {
    id: 'test-user-1',
    username: 'teste',
    name: 'Usuário Teste',
    email: 'teste@mentei.com',
    password: 'teste123',
    image: generateRealPersonAvatar('men'),
    isPro: true,
    level: 15,
    points: 2500
  },
  'demo@mentei.com': {
    id: 'test-user-2',
    username: 'demo',
    name: 'Demo User',
    email: 'demo@mentei.com',
    password: 'Demo123!',
    image: generateRealPersonAvatar('women'),
    isPro: false,
    level: 5,
    points: 500
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Verificar se o usuário existe
    const user = mockUsers[email];
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar senha simples
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Criar resposta com dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    }, { status: 200 });
    
    // Definir cookie de autenticação
    response.cookies.set({
      name: 'mock_auth_token',
      value: JSON.stringify(userWithoutPassword),
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
      sameSite: 'lax'
    });
    
    return response;
    
  } catch (error) {
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}