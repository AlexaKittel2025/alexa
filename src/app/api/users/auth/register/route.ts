import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/api/prisma';
import { hashPassword, generateToken, sanitizeUser } from '@/app/api/shared/auth-utils';
import { setAuthCookie } from '@/lib/auth-cookie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Remoção de log que expõe dados sensíveis
    
    const { username, displayName, email, password } = body;
    
    // Validar campos obrigatórios
    if (!username || !displayName || !email || !password) {
      console.log('Erro de validação: campos obrigatórios ausentes');
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Validar formato de email (expressão mais robusta)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.log('Erro de validação: formato de email inválido');
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }
    
    // Validar senha (requisitos de complexidade)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.log('Erro de validação: senha muito curta');
      return NextResponse.json(
        { success: false, error: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números' },
        { status: 400 }
      );
    }
    
    // Verificar se username ou email já existem usando Prisma (mensagem genérica para segurança)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      // Não expor qual campo específico está duplicado (proteção contra enumeração)
      const errorMessage = 'Credenciais inválidas. Tente outros dados.';
      
      // Log interno menos detalhado
      console.log('Tentativa de registro com credenciais já utilizadas');
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
    
    // Hash da senha antes de armazenar
    const hashedPassword = await hashPassword(password);
    
    // Criar novo usuário no banco usando Prisma
    const newUser = await prisma.user.create({
      data: {
        username,
        display_name: displayName,
        email,
        password_hash: hashedPassword,
        photo_url: `https://avatars.dicebear.com/api/initials/${displayName.substring(0, 2)}.svg`,
        // Remover referência a settings que não existe no schema
      }
    });
    
    // Log seguro sem dados específicos
    console.log('Registro de usuário realizado com sucesso');
    
    // Gerar um token JWT usando a função de utilitário
    const token = generateToken(newUser);
    
    // Remover dados sensíveis do objeto de resposta
    const safeUser = sanitizeUser(newUser);
    
    // Criar resposta com cookie seguro
    const response = NextResponse.json({
      success: true,
      user: safeUser,
    }, { status: 201 });
    
    // Definir cookie HTTPOnly com o token em vez de retorná-lo na resposta
    response.cookies.set({
      name: 'mentei_auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
      sameSite: 'lax'
    });
    
    return response;
    
  } catch (error) {
    console.error('Erro ao processar registro de usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 