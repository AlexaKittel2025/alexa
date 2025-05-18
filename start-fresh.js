const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando reconstrução do projeto...');

// 1. Limpar cache e builds
console.log('1. Limpando cache e builds...');
try {
  execSync('rm -rf .next', { stdio: 'inherit' });
  execSync('rm -rf node_modules/.cache', { stdio: 'inherit' });
} catch (e) {
  console.log('Diretórios já limpos');
}

// 2. Verificar se node_modules existe
if (!fs.existsSync('node_modules')) {
  console.log('2. Instalando dependências...');
  execSync('npm install', { stdio: 'inherit' });
} else {
  console.log('2. Dependências já instaladas');
}

// 3. Gerar Prisma
console.log('3. Gerando cliente Prisma...');
execSync('npx prisma generate', { stdio: 'inherit' });

// 4. Iniciar servidor de desenvolvimento
console.log('4. Iniciando servidor...');
execSync('npm run dev', { stdio: 'inherit' });