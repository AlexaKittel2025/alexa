#!/bin/bash

# Limpar processos anteriores
echo "🧹 Limpando processos anteriores..."
pkill -f "next dev" || true
pkill -f "node server.js" || true

# Garantir que o banco existe
if [ ! -f "./prisma/dev.db" ]; then
  echo "📦 Configurando banco de dados..."
  npm run setup:dev
fi

# Iniciar apenas o Next.js
echo "🚀 Iniciando aplicação..."
echo "📱 Acesse: http://localhost:3000"
echo ""
npm run dev:frontend