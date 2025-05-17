/**
 * Utilitários de autenticação para a aplicação
 * Implementa funções para verificação de tokens
 */

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

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
 * @param token - O token JWT a ser verificado
 * @returns O payload decodificado se o token for válido
 * @throws Error se o token for inválido
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    // Em produção, use uma chave secreta do .env
    const JWT_SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-jwt-secret-should-be-in-env-variables'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return payload as TokenPayload;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
}

/**
 * Gera um novo token JWT
 * @param payload - Os dados a serem incluídos no token
 * @param expiresIn - Tempo de expiração em segundos (padrão: 24 horas)
 * @returns O token JWT gerado
 */
export async function generateToken(
  payload: Omit<TokenPayload, 'iat' | 'exp'>,
  expiresIn: number = 60 * 60 * 24
): Promise<string> {
  const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-jwt-secret-should-be-in-env-variables'
  );
  
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Obtém o token de autenticação da requisição
 * @param request - O objeto de requisição Next.js
 * @returns O token de autenticação ou null se não existir
 */
export function getAuthToken(request: NextRequest): string | null {
  // Tenta obter o token do cookie
  const cookieToken = request.cookies.get('auth-token')?.value;
  if (cookieToken) return cookieToken;
  
  // Tenta obter o token do cabeçalho Authorization
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

/**
 * Verifica se o usuário está autenticado na requisição
 * @param request - O objeto de requisição Next.js
 * @returns true se o usuário estiver autenticado, false caso contrário
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = getAuthToken(request);
  
  if (!token) return false;
  
  try {
    await verifyToken(token);
    return true;
  } catch (error) {
    return false;
  }
}