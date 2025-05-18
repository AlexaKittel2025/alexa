// Configuração centralizada do app
export const config = {
  // URLs da API
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 30000,
  },
  
  // Configurações de autenticação
  auth: {
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 dias
    secureCookies: process.env.NODE_ENV === 'production',
  },
  
  // Limites e restrições
  limits: {
    maxUploadSize: 5 * 1024 * 1024, // 5MB
    maxCommentLength: 500,
    maxPostLength: 1000,
    maxBioLength: 150,
  },
  
  // Configurações de paginação
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 50,
  },
  
  // Configurações de cache
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutos
    staleWhileRevalidate: 60 * 60 * 1000, // 1 hora
  },
  
  // Features flags
  features: {
    enablePWA: true,
    enableNotifications: true,
    enableChat: true,
    enableStories: true,
  },
  
  // Configurações de desenvolvimento
  dev: {
    mockApiDelay: 500,
    logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  },
};