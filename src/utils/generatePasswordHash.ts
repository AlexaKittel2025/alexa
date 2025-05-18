import bcrypt from 'bcryptjs';

// Função para gerar hash de senha
export async function generatePasswordHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Função para verificar se o hash está correto
export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Gerar hashes para as senhas de teste
export async function generateTestHashes() {
  const teste123Hash = await generatePasswordHash('teste123');
  const demo123Hash = await generatePasswordHash('Demo123!');

  return {
    teste123: teste123Hash,
    demo123: demo123Hash
  };
}