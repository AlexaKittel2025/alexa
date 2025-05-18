const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  // Criar usuários de teste
  const users = [
    {
      username: 'teste',
      display_name: 'Usuário Teste',
      email: 'teste@mentei.com',
      password: 'teste123',
      isPro: true,
      score: 1000,
      level: 5,
    },
    {
      username: 'demo',
      display_name: 'Demo User',
      email: 'demo@mentei.com',
      password: 'Demo123!',
      isPro: false,
      score: 500,
      level: 3,
    },
    {
      username: 'admin',
      display_name: 'Administrador',
      email: 'admin@mentei.com',
      password: 'Admin123!',
      isPro: true,
      score: 2000,
      level: 10,
    },
  ];

  for (const userData of users) {
    const { password, ...rest } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...rest,
        password_hash,
      },
    });
    
    console.log(`✓ Criado usuário: ${user.username}`);
  }
  
  // Buscar usuários criados
  const [testUser, demoUser, adminUser] = await Promise.all([
    prisma.user.findUnique({ where: { username: 'teste' } }),
    prisma.user.findUnique({ where: { username: 'demo' } }),
    prisma.user.findUnique({ where: { username: 'admin' } }),
  ]);
  
  // Criar posts de exemplo
  const posts = [
    {
      userId: testUser.id,
      content: 'Hoje eu vi um unicórnio no supermercado comprando cenouras. Ele disse que era para fazer uma sopa mágica!',
    },
    {
      userId: demoUser.id,
      content: 'Descobri que meu gato é na verdade um alienígena disfarçado. Ele usa o laptop quando eu durmo para enviar relatórios para o planeta dele.',
    },
    {
      userId: adminUser.id,
      content: 'Minha avó tem 102 anos e acabou de ganhar uma medalha de ouro nas Olimpíadas de breakdance.',
    },
    {
      userId: testUser.id,
      content: 'Encontrei uma nota de R$ 3,50 hoje. Sim, três reais e cinquenta centavos em uma única nota!',
    },
  ];
  
  for (const postData of posts) {
    const post = await prisma.post.create({
      data: postData,
    });
    console.log(`✓ Criado post: ${post.id}`);
  }
  
  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });