/**
 * Sistema de autenticação baseado em cookies HTTPOnly seguros
 * Substitui o uso de localStorage para armazenamento de tokens
 */

import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { verifyToken } from './jwt';

// Constantes
const AUTH_COOKIE_NAME = 'mentei_auth_token';
const MAX_AGE = 24 * 60 * 60; // 24 horas em segundos

// Interfaces
export interface CookieOptions {
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  domain?: string;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Define um cookie seguro com o token JWT
 * @param token - Token JWT para armazenar
 * @param options - Opções adicionais do cookie
 */
export function setAuthCookie(token: string, options?: CookieOptions): void {
  const defaultOptions: CookieOptions = {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  };

  const cookieOptions = { ...defaultOptions, ...options };
  const cookieStore = cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, cookieOptions as any);
}

/**
 * Obtém o token JWT do cookie
 * @returns Token JWT ou null se não existir
 */
export function getAuthToken(cookieStore?: ReadonlyRequestCookies): string | null {
  const store = cookieStore || cookies();
  const cookie = store.get(AUTH_COOKIE_NAME);
  return cookie ? cookie.value : null;
}

/**
 * Remove o cookie de autenticação
 */
export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Verifica se o usuário está autenticado com base no cookie
 * @returns Promise com booleano indicando se está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  const user = await verifyToken(token);
  return !!user;
}

/**
 * Função auxiliar para uso em middleware ou server actions
 * @param req - Objeto de requisição
 * @returns Token JWT ou null
 */
export function getTokenFromServerRequest(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[AUTH_COOKIE_NAME] || null;
}