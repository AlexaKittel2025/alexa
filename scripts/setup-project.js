const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

async function setupProject() {
  console.log('🚀 Iniciando configuração do projeto Mentei App...\n');

  try {
    // 1. Verificar se existe o arquivo .env.local
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) {
      console.log('⚠️  Arquivo .env.local não encontrado. Criando a partir do exemplo...');
      const envExamplePath = path.join(__dirname, '..', '.env.example');
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ Arquivo .env.local criado com sucesso!');
      } else {
        console.error('❌ Arquivo .env.example não encontrado!');
      }
    }

    // 2. Instalar dependências
    console.log('\n📦 Instalando dependências...');
    await execAsync('npm install');
    console.log('✅ Dependências instaladas!');

    // 3. Gerar Prisma Client
    console.log('\n🔧 Gerando Prisma Client...');
    await execAsync('npx prisma generate');
    console.log('✅ Prisma Client gerado!');

    // 4. Criar banco de dados e migrações
    console.log('\n🗃️  Criando banco de dados e aplicando migrações...');
    try {
      // Tentar criar as migrações
      await execAsync('npx prisma migrate dev --name init');
      console.log('✅ Migrações aplicadas com sucesso!');
    } catch (migrateError) {
      console.log('⚠️  Erro ao aplicar migrações. Tentando push direto...');
      await execAsync('npx prisma db push');
      console.log('✅ Schema sincronizado com o banco!');
    }

    // 5. Seed do banco de dados (se existir)
    const seedPath = path.join(__dirname, '..', 'prisma', 'seed.js');
    if (fs.existsSync(seedPath)) {
      console.log('\n🌱 Aplicando seed no banco de dados...');
      try {
        await execAsync('node prisma/seed.js');
        console.log('✅ Seed aplicado com sucesso!');
      } catch (seedError) {
        console.log('⚠️  Erro ao aplicar seed:', seedError.message);
      }
    }

    // 6. Corrigir problemas de importação
    console.log('\n🔧 Corrigindo problemas de importação...');
    const fixHeroiconsScript = path.join(__dirname, 'fix-heroicons-imports.js');
    if (fs.existsSync(fixHeroiconsScript)) {
      await execAsync('node scripts/fix-heroicons-imports.js');
      console.log('✅ Importações corrigidas!');
    }

    // 7. Criar diretórios necessários
    console.log('\n📁 Criando diretórios necessários...');
    const dirsToCreate = [
      'public/images',
      'public/uploads',
      'src/generated/prisma'
    ];
    
    for (const dir of dirsToCreate) {
      const dirPath = path.join(__dirname, '..', dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Diretório criado: ${dir}`);
      }
    }

    // 8. Verificar se tudo está funcionando
    console.log('\n🔍 Verificando a configuração...');
    const checkCommands = [
      'npx prisma --version',
      'npx next --version',
      'node --version',
      'npm --version'
    ];

    for (const cmd of checkCommands) {
      try {
        const { stdout } = await execAsync(cmd);
        console.log(`✅ ${cmd}: ${stdout.trim()}`);
      } catch (error) {
        console.log(`⚠️  ${cmd}: Não disponível`);
      }
    }

    console.log('\n🎉 Configuração concluída com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Verifique o arquivo .env.local e ajuste as variáveis conforme necessário');
    console.log('2. Execute "npm run dev" para iniciar o servidor de desenvolvimento');
    console.log('3. Acesse http://localhost:3000 no seu navegador');
    console.log('\n💡 Dica: Use o comando "npm run setup:dev" para configuração rápida do desenvolvimento\n');

  } catch (error) {
    console.error('\n❌ Erro durante a configuração:', error.message);
    process.exit(1);
  }
}

// Executar setup
setupProject();