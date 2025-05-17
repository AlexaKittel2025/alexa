import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Interface para o usuário no contexto de autenticação
interface UserAuth {
  id: string;
  username: string;
  email: string;
  [key: string]: any;
}

// Ambiente secreto para JWT, com fallback
const JWT_SECRET = process.env.JWT_SECRET || 'mentei_jwt_secret_key_123456';
const JWT_EXPIRES_IN = '7d'; // Token válido por 7 dias

/**
 * Função para criar hash de senha
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Função para comparar senha com hash
 */
export async function comparePasswords(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Função para gerar token JWT
 */
export function generateToken(user: Partial<UserAuth>): string {
  return jwt.sign(
    { 
      id: user.id,
      username: user.username,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Função para remover dados sensíveis do usuário
 */
export function sanitizeUser(user: any) {
  // Cria uma cópia do objeto sem a senha
  const { password_hash, ...sanitizedUser } = user;
  
  // Remapeia alguns campos para o formato esperado pelo frontend
  return {
    ...sanitizedUser,
    id: sanitizedUser.id.toString(),
    displayName: sanitizedUser.display_name,
    photoURL: sanitizedUser.photo_url || null,
    isPro: sanitizedUser.is_pro,
    createdAt: sanitizedUser.created_at
  };
}

/**
 * Função para verificar token JWT
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
} 