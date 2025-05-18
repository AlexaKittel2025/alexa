/**
 * API endpoint para geração de tokens CSRF
 * Utilizado para proteção contra ataques CSRF
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

/**
 * Gera um novo token CSRF e o define como cookie
 */
export async function GET(request: NextRequest) {
  try {
    // Gerar token CSRF aleatório
    const token = randomBytes(32).toString('hex');
    
    // Criar resposta com o token
    const response = NextResponse.json({ 
      success: true,
      csrfToken: token 
    });
    
    // Definir cookie com o token (httpOnly: false para permitir acesso pelo JavaScript do cliente)
    response.cookies.set({
      name: 'csrf_token',
      value: token,
      httpOnly: false, // Deve ser acessível no cliente para envio nos cabeçalhos
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hora
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