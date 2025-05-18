import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// Verificar se a chave JWT está definida
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  
  // Em produção, lançar um erro seria melhor que usar uma chave padrão
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET deve ser definido em ambiente de produção');
  }
}

// Definir uma chave secreta padrão apenas para desenvolvimento
const getJwtSecret = () => {
  return JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-jwt-secret-only-for-development' : undefined);
};

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  const secret = getJwtSecret();
  
  if (!secret) {
    throw new Error('JWT_SECRET não definido em ambiente de produção');
  }
  
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      username: user.username
    },
    secret,
    { expiresIn: '24h' } // Reduzir tempo de expiração para 24h (mais seguro)
  );
}

export function sanitizeUser(user: User) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
} 