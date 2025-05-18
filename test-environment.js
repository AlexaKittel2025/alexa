#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Testando configuração do ambiente Mentei App...\n');

// Verificar se existe .env ou .env.local
const envFiles = ['.env', '.env.local', '.env.development.local'];
let envFound = false;

console.log('1. Verificando arquivos de configuração:');
envFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`   ${file}: ${exists ? 'ENCONTRADO' : 'Não encontrado'}`);
  if (exists) envFound = true;
});

if (!envFound) {
  console.log('\n⚠️  Nenhum arquivo de configuração encontrado!');
  console.log('   Crie um .env.local ou .env.development.local');
  process.exit(1);
}

// Verificar banco de dados
console.log('\n2. Verificando banco de dados:');
const devDbPath = './prisma/dev.db';
const dbExists = fs.existsSync(devDbPath);
console.log(`   Banco SQLite: ${dbExists ? 'ENCONTRADO' : 'Não encontrado'}`);

// Verificar Prisma
console.log('\n3. Verificando Prisma:');
const prismaClientPath = './node_modules/@prisma/client';
const prismaClientExists = fs.existsSync(prismaClientPath);
console.log(`   Prisma Client: ${prismaClientExists ? 'INSTALADO' : 'Não instalado'}`);

// Verificar package.json
console.log('\n4. Scripts disponíveis:');
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
Object.keys(packageJson.scripts).forEach(script => {
  console.log(`   npm run ${script}`);
});

console.log('\n✅ Teste de ambiente concluído!');
console.log('\nPróximos passos:');
console.log('1. Execute: npm run setup:dev (se ainda não fez)');
console.log('2. Execute: npm run dev');
console.log('3. Acesse: http://localhost:3000');