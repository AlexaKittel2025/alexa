const { PrismaClient } = require('./src/generated/prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida');
    
    // Testar uma query simples
    const users = await prisma.user.findMany({ take: 1 });
    console.log(`✅ Query executada com sucesso. Total de usuários: ${users.length}`);
    
    await prisma.$disconnect();
    console.log('✅ Conexão fechada');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
    process.exit(1);
  }
}

testConnection();