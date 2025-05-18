// Script simples para testar a compilação do projeto
const { exec } = require('child_process');

console.log('Testando compilação do projeto...');

// Testar TypeScript
exec('npx tsc --noEmit', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erros de TypeScript encontrados:');
    console.error(stderr);
    return;
  }
  console.log('✅ TypeScript compilou sem erros');
  
  // Testar build do Next.js
  console.log('Testando build do Next.js...');
  exec('npm run build', (buildError, buildStdout, buildStderr) => {
    if (buildError) {
      console.error('❌ Erros de build encontrados:');
      console.error(buildStderr);
      return;
    }
    console.log('✅ Build completo sem erros!');
  });
});