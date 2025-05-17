import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/api/prisma';
import { comparePasswords, generateToken, sanitizeUser } from '@/app/api/shared/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Recebida solicitação de login:', body);
    
    const { email, password } = body;
    
    // Validar campos obrigatórios
    if (!email || !password) {
      console.log('Erro de validação: email ou senha ausentes');
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Buscar usuário pelo email usando Prisma
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('Erro de autenticação: usuário não encontrado');
      return NextResponse.json(
        { success: false, error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }
    
    // Verificar se a senha está correta usando bcrypt
    const isPasswordValid = await comparePasswords(password, user.password_hash);
    
    if (!isPasswordValid) {
      console.log('Erro de autenticação: senha inválida');
      return NextResponse.json(
        { success: false, error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }
    
    console.log('Login bem-sucedido para:', email);
    
    // Gerar um token JWT usando a função de utilitário
    const token = generateToken(user);
    
    // Remover dados sensíveis do objeto de resposta
    const safeUser = sanitizeUser(user);
    
    // Criar resposta com cookie seguro
    const response = NextResponse.json({
      success: true,
      user: safeUser,
    }, { status: 200 });
    
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
    console.error('Erro ao processar login:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 