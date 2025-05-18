/**
 * Utilitários de autenticação para a aplicação
 * Implementa funções para verificação de tokens
 */

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Re-exportar authOptions de auth.config.ts
export { authOptions } from './auth.config';

// Interface para o payload do token JWT
export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Verifica um token JWT
 * @param token - Token JWT a ser verificado
 * @returns Payload do token decodificado ou null se inválido
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = process.env.JWT_SECRET || 'seu-segredo-jwt';
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload as TokenPayload;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

/**
 * Gera um novo token JWT
 * @param payload - Dados a serem incluídos no token
 * @returns Token JWT assinado
 */
export async function generateToken(payload: TokenPayload): Promise<string> {
  const secret = process.env.JWT_SECRET || 'seu-segredo-jwt';
  const encoder = new TextEncoder();
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encoder.encode(secret));
    
  return token;
}

/**
 * Obtém o token do cookie de autenticação
 * @returns Token JWT ou null se não encontrado
 */
export function getTokenFromCookie(): string | null {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth-token');
  return authCookie?.value || null;
}

/**
 * Verifica se a requisição tem um token válido
 * @param request - Objeto NextRequest
 * @returns Payload do token se válido, null caso contrário
 */
export async function verifyRequest(request: NextRequest): Promise<TokenPayload | null> {
  // Verificar no header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    return await verifyToken(token);
  }
  
  // Verificar no cookie
  const token = request.cookies.get('auth-token')?.value;
  if (token) {
    return await verifyToken(token);
  }
  
  return null;
}

/**
 * Middleware para proteger rotas autenticadas
 * @param request - Objeto NextRequest
 * @returns TokenPayload se autenticado, null caso contrário
 */
export async function requireAuth(request: NextRequest): Promise<TokenPayload | null> {
  const payload = await verifyRequest(request);
  
  if (!payload) {
    throw new Error('Unauthorized');
  }
  
  return payload;
}

/**
 * Define o cookie de autenticação
 * @param token - Token JWT a ser armazenado
 */
export function setAuthCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/'
  });
}

/**
 * Remove o cookie de autenticação
 */
export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
}