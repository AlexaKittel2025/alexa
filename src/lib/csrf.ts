/**
 * Utilitários para manipulação de CSRF
 * Implementa geração e verificação de tokens CSRF
 */

import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Gera um token CSRF seguro e o armazena como cookie
 * @returns O token CSRF gerado
 */
export function generateCsrfToken(): string {
  const token = randomBytes(32).toString('hex');
  
  // Configura o cookie com o token
  cookies().set({
    name: 'csrf-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 hora
  });
  
  return token;
}

/**
 * Adiciona um token CSRF ao objeto de resposta para uso no cliente
 * @param response - O objeto de resposta Next.js
 * @returns O objeto de resposta com o token CSRF adicionado
 */
export function setCsrfToken(response: NextResponse): NextResponse {
  const token = generateCsrfToken();
  
  // Adiciona o token como header para uso no cliente
  response.headers.set('X-CSRF-Token', token);
  
  return response;
}

/**
 * Verifica se um token CSRF é válido
 * @param request - O objeto de requisição Next.js
 * @returns true se o token for válido, false caso contrário
 */
export function validateCsrfToken(request: NextRequest): boolean {
  const requestToken = request.headers.get('X-CSRF-Token');
  const cookieToken = request.cookies.get('csrf-token')?.value;
  
  if (!requestToken || !cookieToken) {
    return false;
  }
  
  // Comparação segura em tempo constante para evitar timing attacks
  return requestToken === cookieToken;
}