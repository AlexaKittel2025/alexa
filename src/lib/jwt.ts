import jwt from 'jsonwebtoken';

// Verificar se a chave JWT está definida
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('ATENÇÃO: JWT_SECRET não está definido no ambiente. Use variáveis de ambiente adequadas em produção.');
  // Em produção, lançar um erro seria melhor que usar uma chave padrão
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET deve ser definido em ambiente de produção');
  }
}

interface User {
  id: string;
  username: string;
  display_name: string;
  email: string;
  photo_url?: string;
}

export async function verifyToken(token: string): Promise<User | null> {
  // Definir uma chave secreta padrão apenas para desenvolvimento
  const secret = JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-jwt-secret-only-for-development' : undefined);
  
  if (!secret) {
    throw new Error('JWT_SECRET não definido em ambiente de produção');
  }
  
  try {
    const decoded = jwt.verify(token, secret) as User;
    return decoded;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

export async function generateToken(user: User): Promise<string> {
  // Definir uma chave secreta padrão apenas para desenvolvimento
  const secret = JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-jwt-secret-only-for-development' : undefined);
  
  if (!secret) {
    throw new Error('JWT_SECRET não definido em ambiente de produção');
  }
  
  // Reduzir tempo de expiração para 24h (mais seguro)
  return jwt.sign(user, secret, { expiresIn: '24h' });
} 