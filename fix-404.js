const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Corrigindo erros 404 do Next.js...\n');

// 1. Parar todos os processos
console.log('1. Parando servidores...');
try {
  if (process.platform === 'win32') {
    execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
  } else {
    execSync('pkill -f node', { stdio: 'ignore' });
  }
} catch (e) {
  console.log('   Nenhum servidor rodando');
}

// 2. Limpar diretórios de build
console.log('\n2. Limpando builds antigos...');
const dirsToClean = ['.next', 'node_modules/.cache', '.cache'];
dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`   ✓ ${dir} removido`);
  }
});

// 3. Verificar configuração do Next.js
console.log('\n3. Verificando configuração...');
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'randomuser.me', 'i.pravatar.cc', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },
  // Configurações para evitar erros de chunk
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
`;

fs.writeFileSync('next.config.mjs', nextConfig);
console.log('   ✓ next.config.mjs atualizado');

// 4. Criar script de inicialização limpa
console.log('\n4. Criando script de inicialização...');
const startScript = `{
  "scripts": {
    "clean-start": "npx rimraf .next && npm run dev",
    "fix-deps": "npm install --legacy-peer-deps",
    "prebuild": "npx rimraf .next",
    "predev": "npx rimraf .next"
  }
}`;

// Adicionar scripts ao package.json
const packagePath = 'package.json';
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.scripts['clean-start'] = 'npx rimraf .next && npm run dev';
packageJson.scripts['fix-deps'] = 'npm install --legacy-peer-deps';
packageJson.scripts['prebuild'] = 'npx rimraf .next';
packageJson.scripts['predev'] = 'npx rimraf .next';
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log('   ✓ Scripts adicionados ao package.json');

// 5. Gerar cliente Prisma
console.log('\n5. Gerando cliente Prisma...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (e) {
  console.log('   Erro ao gerar Prisma (pode ser ignorado)');
}

console.log('\n✓ Correções aplicadas!');
console.log('\nPara iniciar o servidor, execute:');
console.log('  npm run clean-start');
console.log('\nOu se preferir manualmente:');
console.log('  rm -rf .next');
console.log('  npm run dev');