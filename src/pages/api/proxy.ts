import type { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

// Opções para o servidor de proxy
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Função para criar um proxy para qualquer rota
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const target = 'http://localhost:3001';
  
  console.log(`Proxy recebeu requisição ${req.method} para ${req.url || ''}`);

  return httpProxyMiddleware(req, res, {
    target,
    pathRewrite: [
      {
        patternStr: '^/api/proxy',
        replaceStr: '/api'
      }
    ],
    changeOrigin: true,
  });
} 