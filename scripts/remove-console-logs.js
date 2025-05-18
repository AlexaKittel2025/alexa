#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Procura todos os arquivos TypeScript/JavaScript no src
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');

let totalRemoved = 0;

files.forEach(file => {
  const filePath = path.resolve(file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Não remover de arquivos de teste ou desenvolvimento
  if (filePath.includes('test') || filePath.includes('dev')) {
    return;
  }
  
  // Remove console.log, console.error, console.warn de produção
  content = content.replace(/console\.(log|error|warn)\([^)]*\);?/g, '');
  
  // Remove linhas vazias extras criadas pela remoção
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Removidos console.* de: ${file}`);
    totalRemoved++;
  }
});

console.log(`\nTotal de arquivos modificados: ${totalRemoved}`);
console.log('Console logs removidos com sucesso!');