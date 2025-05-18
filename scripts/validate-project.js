#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validando projeto Mentei App...\n');

const errors = [];
const warnings = [];
const successes = [];

// Verificar dependências
try {
  execSync('npm ls', { stdio: 'ignore' });
  successes.push('✅ Todas as dependências estão instaladas corretamente');
} catch (error) {
  errors.push('❌ Problemas com dependências. Execute: npm install');
}

// Verificar TypeScript
try {
  execSync('npx tsc --noEmit', { stdio: 'ignore' });
  successes.push('✅ Código TypeScript válido');
} catch (error) {
  warnings.push('⚠️ Erros de TypeScript encontrados');
}

// Verificar ESLint
try {
  execSync('npm run lint', { stdio: 'ignore' });
  successes.push('✅ Código passa nas regras do ESLint');
} catch (error) {
  warnings.push('⚠️ Problemas de linting encontrados');
}

// Verificar estrutura de arquivos
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.mjs',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'prisma/schema.prisma'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    successes.push(`✅ ${file} encontrado`);
  } else {
    errors.push(`❌ ${file} não encontrado`);
  }
});

// Verificar variáveis de ambiente
const envFiles = ['.env', '.env.local', '.env.development.local'];
const envFound = envFiles.some(file => fs.existsSync(path.join(process.cwd(), file)));

if (envFound) {
  successes.push('✅ Arquivo de configuração de ambiente encontrado');
} else {
  warnings.push('⚠️ Nenhum arquivo .env encontrado');
}

// Verificar banco de dados
if (fs.existsSync('./prisma/dev.db')) {
  successes.push('✅ Banco de dados SQLite encontrado');
} else {
  warnings.push('⚠️ Banco de dados não encontrado. Execute: npm run prisma:migrate');
}

// Relatório final
console.log('\n📊 Relatório de Validação:\n');

if (successes.length > 0) {
  console.log('Sucessos:');
  successes.forEach(success => console.log(success));
  console.log('');
}

if (warnings.length > 0) {
  console.log('Avisos:');
  warnings.forEach(warning => console.log(warning));
  console.log('');
}

if (errors.length > 0) {
  console.log('Erros:');
  errors.forEach(error => console.log(error));
  console.log('');
}

// Resumo
console.log(`\n📈 Resumo: ${successes.length} ✅ | ${warnings.length} ⚠️ | ${errors.length} ❌`);

if (errors.length === 0) {
  console.log('\n🎉 Projeto validado com sucesso! Pronto para desenvolvimento.');
} else {
  console.log('\n⚠️ Corrija os erros antes de continuar o desenvolvimento.');
  process.exit(1);
}