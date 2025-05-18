const fs = require('fs');
const path = require('path');

console.log('Diagnóstico do Projeto Mentei App\n');

// 1. Verificar arquivos importantes
const importantFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/loading.tsx',
  'src/app/error.tsx',
  'src/app/not-found.tsx',
  'next.config.mjs',
  'package.json',
  '.env.local'
];

console.log('1. Verificando arquivos importantes:');
importantFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${file}: ${exists ? '✓' : '✗'}`);
});

// 2. Verificar diretórios
console.log('\n2. Verificando diretórios:');
const dirs = [
  'src/app',
  'src/components',
  'public',
  '.next',
  'node_modules'
];

dirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`   ${dir}: ${exists ? '✓' : '✗'}`);
});

// 3. Verificar .next directory
if (fs.existsSync('.next')) {
  console.log('\n3. Conteúdo do diretório .next:');
  const nextContents = fs.readdirSync('.next');
  console.log(`   Arquivos: ${nextContents.length}`);
  console.log(`   Pastas: ${nextContents.filter(f => fs.statSync(path.join('.next', f)).isDirectory()).join(', ')}`);
}

// 4. Verificar package.json scripts
console.log('\n4. Scripts disponíveis:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
Object.keys(packageJson.scripts).forEach(script => {
  console.log(`   ${script}: ${packageJson.scripts[script]}`);
});

// 5. Verificar versão do Next.js
console.log('\n5. Versão do Next.js:');
console.log(`   ${packageJson.dependencies.next}`);

// 6. Sugestões
console.log('\n6. Sugestões de correção:');
console.log('   - Execute: npm run build');
console.log('   - Execute: npm run dev');
console.log('   - Verifique se todas as páginas estão exportando componentes válidos');
console.log('   - Verifique o console do navegador para mais detalhes');