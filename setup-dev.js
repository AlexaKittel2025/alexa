const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando ambiente de desenvolvimento...');

// Usar o arquivo .env.development.local se existir
const envPath = path.join(__dirname, '.env.development.local');
const defaultEnvPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('✓ Usando .env.development.local');
  process.env.DATABASE_URL = 'file:./dev.db';
} else if (fs.existsSync(defaultEnvPath)) {
  console.log('✓ Usando .env.local');
}

try {
  // 1. Gerar cliente Prisma com schema SQLite
  console.log('📦 Gerando cliente Prisma para SQLite...');
  execSync('npx prisma generate --schema=./prisma/schema.dev.prisma', { stdio: 'inherit' });
  
  // 2. Criar e aplicar migrações
  console.log('🗄️ Criando banco de dados SQLite...');
  execSync('npx prisma db push --schema=./prisma/schema.dev.prisma --skip-generate', { stdio: 'inherit' });
  
  // 3. Seed do banco (se existir)
  if (fs.existsSync(path.join(__dirname, 'prisma', 'seed-dev.js'))) {
    console.log('🌱 Executando seed do banco...');
    execSync('node prisma/seed-dev.js', { stdio: 'inherit' });
  }
  
  console.log('✅ Ambiente de desenvolvimento configurado com sucesso!');
  console.log('💡 Execute "npm run dev" para iniciar o servidor');
  
} catch (error) {
  console.error('❌ Erro ao configurar ambiente:', error.message);
  process.exit(1);
}