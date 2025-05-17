import { prisma } from '@/api/prisma';
import { hashPassword, generateToken, sanitizeUser } from '@/app/api/shared/auth-utils';
import { mockUsersAuth, verifyMockCredentials } from './MockAuthService';

export interface RegisterData {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export class AuthApiService {
  // Validações
  private static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  private static validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
    return passwordRegex.test(password);
  }
  
  // Registro
  static async register(data: RegisterData) {
    const { username, displayName, email, password } = data;
    
    // Validar campos obrigatórios
    if (!username || !displayName || !email || !password) {
      throw new Error('Todos os campos são obrigatórios');
    }
    
    // Validar formato de email
    if (!this.validateEmail(email)) {
      throw new Error('Formato de email inválido');
    }
    
    // Validar senha
    if (!this.validatePassword(password)) {
      throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números');
    }
    
    // Verificar se username ou email já existem
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      // Não expor qual campo específico está duplicado
      throw new Error('Credenciais inválidas. Tente outros dados.');
    }
    
    // Hash da senha
    const hashedPassword = await hashPassword(password);
    
    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: {
        username,
        display_name: displayName,
        email,
        password_hash: hashedPassword,
        photo_url: `https://avatars.dicebear.com/api/initials/${displayName.substring(0, 2)}.svg`,
      }
    });
    
    // Gerar token
    const token = generateToken(newUser);
    
    // Retornar usuário sanitizado e token
    return {
      user: sanitizeUser(newUser),
      token
    };
  }
  
  // Login
  static async login(data: LoginData) {
    const { username, password } = data;
    
    // Validar campos obrigatórios
    if (!username || !password) {
      throw new Error('Username e senha são obrigatórios');
    }
    
    // Em desenvolvimento, verificar primeiro os usuários mock
    console.log('NODE_ENV:', process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Tentando login com mock para:', username);
      const mockUser = await verifyMockCredentials(username, password);
      if (mockUser) {
        console.log('Login com usuário mock:', mockUser.username);
        // Gerar token para o usuário mock
        const token = generateToken(mockUser as any);
        return {
          user: sanitizeUser(mockUser as any),
          token
        };
      }
      console.log('Mock login falhou, tentando Prisma');
    }
    
    // Buscar usuário no banco de dados
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email: username }
          ]
        }
      });
      
      if (!user) {
        throw new Error('Credenciais inválidas');
      }
      
      // Verificar senha
      const isPasswordValid = await this.verifyPassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }
      
      // Gerar token
      const token = generateToken(user);
      
      // Retornar usuário sanitizado e token
      return {
        user: sanitizeUser(user),
        token
      };
    } catch (error) {
      // Se houver erro com o Prisma, tentar com mock em desenvolvimento
      console.log('Erro com Prisma:', error);
      if (process.env.NODE_ENV !== 'production') {
        console.log('Erro com Prisma, tentando com usuário mock');
        const mockUser = await verifyMockCredentials(username, password);
        if (mockUser) {
          const token = generateToken(mockUser as any);
          return {
            user: sanitizeUser(mockUser as any),
            token
          };
        }
      }
      throw new Error('Credenciais inválidas');
    }
  }
  
  // Função auxiliar para verificar senha
  private static async verifyPassword(password: string, hash: string): Promise<boolean> {
    // Importar bcrypt dinamicamente para evitar problemas de bundle
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
  }
}