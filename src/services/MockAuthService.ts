import { generateRealPersonAvatar } from '@/utils/avatarUtils';
import bcrypt from 'bcryptjs';

// Mock de usuários para desenvolvimento e testes
export const mockUsersAuth = [
  {
    id: 'test-user-1',
    username: 'teste',
    display_name: 'Usuário Teste',
    email: 'teste@mentei.com',
    password_hash: '$2b$10$0UgM.FQagKNJEeW7HpbryuLjGftgG6QvKDo.tMHgYJ01J1BvmMYSm', // senha: teste123
    photo_url: generateRealPersonAvatar('men'),
    created_at: new Date().toISOString(),
    bio: 'Usuário de teste do sistema Mentei',
    is_pro: true,
    level: 15,
    points: 2500
  },
  {
    id: 'test-user-2',
    username: 'demo',
    display_name: 'Demo User',
    email: 'demo@mentei.com',
    password_hash: '$2b$10$9bDon2Kn90FEN7E5wuqh8.TBWLNBFxTvEv.5CbLWu/XyGtOx3GjZO', // senha: Demo123!
    photo_url: generateRealPersonAvatar('women'),
    created_at: new Date().toISOString(),
    bio: 'Conta de demonstração',
    is_pro: false,
    level: 5,
    points: 500
  }
];

// Função para verificar credenciais mock
export async function verifyMockCredentials(username: string, password: string) {

  // Procurar usuário por username ou email
  const user = mockUsersAuth.find(u => 
    u.username === username || u.email === username
  );
  
  if (!user) {
    
    return null;
  }

  // Verificar senha
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return null;
  }
  
  // Retornar usuário sem a senha
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Credenciais de teste para facilitar o desenvolvimento
export const testCredentials = [
  {
    username: 'teste',
    email: 'teste@mentei.com',
    password: 'teste123',
    description: 'Usuário PRO de teste'
  },
  {
    username: 'demo',
    email: 'demo@mentei.com',
    password: 'Demo123!',
    description: 'Usuário comum de demonstração'
  }
];