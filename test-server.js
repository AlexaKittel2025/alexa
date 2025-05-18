console.log('Iniciando teste do servidor...');

// Testar Prisma
try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  console.log('✓ Prisma carregado com sucesso');
  
  prisma.$connect()
    .then(() => console.log('✓ Conexão com banco estabelecida'))
    .catch(err => console.error('✗ Erro na conexão:', err));
} catch (error) {
  console.error('✗ Erro ao carregar Prisma:', error.message);
}

// Testar Next
try {
  const next = require('next');
  console.log('✓ Next.js carregado com sucesso');
} catch (error) {
  console.error('✗ Erro ao carregar Next.js:', error.message);
}

// Testar Express
try {
  const express = require('express');
  const app = express();
  const PORT = 3001;
  
  app.get('/test', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  app.listen(PORT, () => {
    console.log(`✓ Servidor Express rodando na porta ${PORT}`);
  });
} catch (error) {
  console.error('✗ Erro ao iniciar Express:', error.message);
}

// Verificar variáveis de ambiente
console.log('\nVariáveis de ambiente:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Definido' : '✗ Não definido');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓ Definido' : '✗ Não definido');