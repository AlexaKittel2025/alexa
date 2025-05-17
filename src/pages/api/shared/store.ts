// Armazenamento em memória para dados compartilhados entre APIs
// Em uma aplicação real isso seria um banco de dados
import bcrypt from 'bcryptjs';

export interface StoredUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  password_hash: string;
  photoURL?: string;
  bio?: string;
  points: number;
  level: number;
  isPro: boolean;
  createdAt: string;
  achievements: any[];
  [key: string]: any;
}

// Função para criar hash de senha
export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

// Dados de usuário em memória
export const users: StoredUser[] = [
  // Usuário de teste pré-cadastrado
  {
    id: 'user-test-123',
    username: 'teste',
    displayName: 'Usuário Teste',
    email: 'teste@teste.com',
    password_hash: hashPassword('teste123'),
    photoURL: 'https://avatars.dicebear.com/api/initials/UT.svg',
    bio: 'Este é um usuário de teste.',
    points: 10,
    level: 1,
    isPro: false,
    createdAt: new Date().toISOString(),
    achievements: []
  },
  // Administrador pré-cadastrado
  {
    id: 'admin-test-456',
    username: 'admin',
    displayName: 'Administrador',
    email: 'admin@mentei.com',
    password_hash: hashPassword('admin123'),
    photoURL: 'https://avatars.dicebear.com/api/initials/AD.svg',
    bio: 'Conta de administrador do sistema.',
    points: 100,
    level: 5,
    isPro: true,
    createdAt: new Date().toISOString(),
    achievements: []
  }
];

// Função de conveniência para buscar usuário por email
export function findUserByEmail(email: string): StoredUser | undefined {
  return users.find(u => u.email === email);
}

// Função de conveniência para buscar usuário por username
export function findUserByUsername(username: string): StoredUser | undefined {
  return users.find(u => u.username === username);
}

// Função para criar um novo usuário
export function createUser(userData: Omit<StoredUser, 'id'>): StoredUser {
  // Primeiro crio o novo objeto com os dados do usuário
  // e depois adiciono o id gerado
  const newUser = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  } as StoredUser;
  
  users.push(newUser);
  return newUser;
}

// Função para remover dados sensíveis do usuário
export function sanitizeUser(user: StoredUser) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// Função para listar todos os usuários (sem dados sensíveis)
export function listUsers() {
  return users.map(sanitizeUser);
} 