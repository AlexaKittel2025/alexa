import { NextRequest, NextResponse } from 'next/server';
import { AuthApiService } from '@/services/AuthApiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { user, token } = await AuthApiService.register({
      username: body.username,
      displayName: body.displayName,
      email: body.email,
      password: body.password
    });
    
    console.log('Registro de usuário realizado com sucesso');
    
    // Criar resposta
    const response = NextResponse.json({
      success: true,
      user,
    }, { status: 201 });
    
    // Definir cookie HTTPOnly com o token
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
    
    if (error instanceof Error) {
      const message = error.message;
      
      // Determinar status code baseado no tipo de erro
      let statusCode = 500;
      if (message.includes('obrigatórios') || 
          message.includes('inválido') || 
          message.includes('senha deve ter') ||
          message.includes('Credenciais inválidas')) {
        statusCode = 400;
      }
      
      return NextResponse.json(
        { success: false, error: message },
        { status: statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}