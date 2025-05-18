// Script simples para iniciar o Next.js
const { spawn } = require('child_process');

console.log('🚀 Iniciando Next.js...');

const next = spawn('npm', ['run', 'dev:frontend'], {
  stdio: 'inherit',
  shell: true
});

next.on('error', (error) => {
  console.error('Erro ao iniciar:', error);
});

next.on('close', (code) => {
  console.log(`Next.js encerrado com código ${code}`);
});