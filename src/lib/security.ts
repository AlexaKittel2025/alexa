/**
 * Utilitários de segurança para a aplicação
 * Implementa funções de segurança comuns como sanitização
 */

// Sanitiza strings para prevenir XSS
export function sanitizeString(str: string): string {
  if (!str) return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitiza objetos recursivamente
export function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = sanitizeObject(obj[key]);
    return acc;
  }, {} as Record<string, any>);
}

// Retorna cabeçalhos de segurança padrão
export function getSecurityHeaders(): Record<string, string> {
  return {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'"
  };
}

// Verifica se uma string contém caracteres potencialmente perigosos
export function containsDangerousContent(input: string): boolean {
  // Detecta padrões de XSS comuns
  const xssPattern = /<script|javascript:|on\w+\s*=|data:text\/html/i;
  
  // Detecta padrões de injeção SQL básicos
  const sqlPattern = /(\b(select|insert|update|delete|drop|alter|exec|union)\b.*\b(from|into|table|database|schema)\b)|('|").*\1\s*(--|#|\/\*)/i;
  
  return xssPattern.test(input) || sqlPattern.test(input);
}