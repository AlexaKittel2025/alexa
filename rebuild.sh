#!/bin/bash

echo "Reconstruindo o projeto Mentei App..."

# Limpar cache e builds antigos
echo "1. Limpando cache e builds..."
rm -rf .next
rm -rf node_modules/.cache
npm cache clean --force

# Reinstalar dependências
echo "2. Reinstalando dependências..."
npm install

# Gerar cliente Prisma
echo "3. Gerando cliente Prisma..."
npx prisma generate

# Criar novo build
echo "4. Criando novo build..."
npm run build

echo "Build concluído! Execute 'npm run dev' para iniciar o servidor."