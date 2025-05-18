#!/bin/bash
echo "Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "Iniciando servidor..."
npm run dev