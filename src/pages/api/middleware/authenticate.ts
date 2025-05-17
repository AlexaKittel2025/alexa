import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../shared/auth-utils';

/**
 * Middleware para autenticar requisições
 * 
 * @param handler Função de manipulação da requisição
 * @returns Função de manipulação com autenticação
 */
export function authenticate(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Obter o token do cabeçalho Authorization
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          error: 'Token de autenticação não fornecido'
        });
      }
      
      // O formato esperado é "Bearer <token>"
      const parts = authHeader.split(' ');
      
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
          success: false,
          error: 'Formato de token inválido'
        });
      }
      
      const token = parts[1];
      
      // Verificar o token
      const decoded = verifyToken(token);
      
      // Adicionar o usuário decodificado à requisição
      req.user = decoded;
      
      // Continuar com a requisição
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido ou expirado'
      });
    }
  };
}

// Adicionar tipagem para o req.user
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      username: string;
      email: string;
      [key: string]: any;
    };
  }
} 