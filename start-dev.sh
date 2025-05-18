#!/bin/bash

echo "🚀 Iniciando Mentei App em modo desenvolvimento..."

# Carregar variáveis de ambiente
export DATABASE_URL=file:./prisma/dev.db

# Verificar se o banco existe
if [ ! -f "./prisma/dev.db" ]; then
  echo "⚠️  Banco de dados não encontrado. Executando setup..."
  npm run setup:dev
fi

# Iniciar apenas o Next.js 
echo "▶️  Iniciando Next.js..."
npm run dev:frontend