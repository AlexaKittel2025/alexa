/**
 * Middleware de segurança para aplicação Next.js
 * Implementa cabeçalhos de segurança, proteção XSS, CSRF e validação de autenticação
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  '/perfil',
  '/dashboard',
  '/chat',
  '/nova-mentira',
  '/plano-pro',
  // '/configuracoes', // Temporariamente desabilitado para testes
];

// Rotas de API que necessitam de proteção CSRF
const CSRF_PROTECTED_ROUTES = [
  '/api/users',
  '/api/posts',
  '/api/chat',
];

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  '/login',
  '/cadastro',
  '/api/auth',
  '/api/register',
  '/_next',
  '/images',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  // Obter a URL da requisição
  const { pathname } = request.nextUrl;
  
  // Criar a resposta inicial (será modificada conforme necessário)
  let response = NextResponse.next();
  
  // Adicionar cabeçalhos de segurança para todas as respostas
  response = addSecurityHeaders(response);
  
  // Verificar se é uma rota pública
  if (isPublicRoute(pathname)) {
    return response;
  }
  
  // Verificar se é uma rota protegida que requer autenticação
  if (isProtectedRoute(pathname)) {
    return await handleProtectedRoute(request, response);
  }
  
  // Verificar se é uma rota de API que necessita de proteção CSRF
  if (isCsrfProtectedRoute(pathname)) {
    return handleCsrfProtection(request, response);
  }
  
  return response;
}

/**
 * Adiciona cabeçalhos de segurança HTTP às respostas
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevenir carregamento em frames (clickjacking)
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Proteção contra XSS
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Política de segurança de conteúdo (CSP)
  // Importante: isto é uma configuração básica. Ajuste conforme necessidades do projeto
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );
  }
  
  // Política de referenciador
  response.headers.set('Referrer-Policy', 'same-origin');
  
  // Cabeçalho de segurança de transporte estrito (HSTS)
  // Atenção: só habilitar em produção e com HTTPS configurado
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Prevenir detecção de aplicação web (informação sobre a plataforma)
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  return response;
}

/**
 * Verifica se o caminho é uma rota pública
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Verifica se o caminho é uma rota protegida
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Verifica se o caminho é uma rota de API que requer proteção CSRF
 */
function isCsrfProtectedRoute(pathname: string): boolean {
  return CSRF_PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Trata requisições para rotas protegidas verificando autenticação
 */
async function handleProtectedRoute(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  try {
    // Verificar se há sessão válida usando NextAuth
    const token = await getToken({ 
      req: request, 
      secret: process.env.JWT_SECRET 
    });
    
    // Se não há token, redirecionar para login
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.nextUrl.pathname));
      return NextResponse.redirect(url);
    }
    
    // Token válido, prosseguir com a requisição
    return response;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    
    // Em caso de erro, redirecionar para login
    const url = new URL('/login', request.url);
    url.searchParams.set('error', 'auth_error');
    return NextResponse.redirect(url);
  }
}

/**
 * Implementa proteção CSRF para rotas de API
 */
function handleCsrfProtection(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  // Verificar se é um método que modifica dados
  const isDataModifyingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
  
  if (isDataModifyingMethod) {
    // Verificar token CSRF no cabeçalho
    const csrfToken = request.headers.get('X-CSRF-Token');
    const csrfCookie = request.cookies.get('csrf_token')?.value;
    
    // Se não houver token CSRF ou não corresponder ao cookie, rejeitar
    if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie) {
      return new NextResponse(
        JSON.stringify({ error: 'Erro de validação CSRF' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  return response;
}

export const config = {
  // Aplicar o middleware a todas as rotas
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};