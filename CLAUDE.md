# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Mentei App - Instruções para Claude Code

Este é um projeto chamado Mentei App, baseado em Next.js 14.0.3 com TypeScript e React, contendo frontend e backend integrados via concurrently. O frontend roda na porta 3000 e o backend é inicializado com server.js.

## Comandos Principais

### Desenvolvimento
- `npm run dev` - Inicia o ambiente de desenvolvimento completo com frontend e backend simultaneamente
- `npm run dev:frontend` - Inicia apenas o frontend Next.js na porta 3000
- `npm run dev:backend` - Inicia apenas o servidor backend Node.js na porta 3001
- `npm run lint` - Executa o linter para verificar problemas de código
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o projeto compilado para produção

### Banco de Dados (PostgreSQL via Prisma)
- `npx prisma generate` - Gera o cliente Prisma (executado automaticamente após `npm install`)
- `npx prisma migrate dev` - Cria e aplica migrações durante o desenvolvimento
- `npx prisma db push` - Sincroniza o esquema com o banco de dados sem criar migrações
- `npx prisma studio` - Interface gráfica para visualizar e editar dados no banco

## Arquitetura do Projeto

### Estrutura Frontend-Backend
- **Frontend**: Next.js com TypeScript e React, utilizando o sistema de roteamento App Router (/app)
- **Backend**: Servidor Express (server.js) que roda em paralelo com o Next.js para APIs customizadas
- **Integração**: O backend serve tanto as APIs RESTful quanto configura o Next.js para servir o front-end

### Autenticação e Dados
- **Autenticação**: Implementada via NextAuth.js e Firebase, com suporte a senhas e provedores externos
- **Banco de Dados**: PostgreSQL gerenciado pelo Prisma ORM
- **Real-time**: Comunicação em tempo real para chat e notificações via Ably

### Estrutura de Arquivos
- `/src/app` - Páginas e rotas da aplicação usando App Router do Next.js
- `/src/components` - Componentes React reutilizáveis
- `/src/lib` - Bibliotecas e serviços de integração (Firebase, Ably, Prisma, etc.)
- `/prisma` - Definição do schema do banco de dados e migrações
- `/public` - Arquivos estáticos e assets para PWA

## Diretrizes de Código

- Responder em português do Brasil, com explicações claras, diretas e bem estruturadas
- Organizar código seguindo a estrutura modular da aplicação
- Utilizar arrow functions, const/let e boa organização de imports
- Implementar componentes React seguindo melhores práticas (Hooks, Context, etc.)
- Separar componentes client e server apropriadamente (usar `"use client"` quando necessário)
- Atualizar o banco de dados seguindo o schema Prisma, com migrações adequadas

## Configurações Importantes

- Variáveis de ambiente em `.env.local` (nunca comitar):
  - Credenciais Firebase (NEXT_PUBLIC_FIREBASE_*)
  - Chaves Ably (NEXT_PUBLIC_ABLY_API_KEY, ABLY_API_KEY)
  - URL do PostgreSQL (DATABASE_URL)
- Docker Compose disponível para ambientes de desenvolvimento com PostgreSQL

## Funcionalidades Principais

- Sistema de usuários com perfis, níveis e conquistas
- Criação e visualização de postagens de "mentiras" ou histórias falsas
- Sistema de reações e comentários
- Chat global em tempo real
- Ranking de usuários e histórias
- Badges e recompensas por conquistas

Ao trabalhar neste projeto, manter a estrutura organizada e garantir que as integrações entre frontend, backend e banco de dados funcionem corretamente.

- Apenas faça modificações seguras, sem introduzir bugs ou mudanças visuais.
Teste mentalmente a integração entre os arquivos antes de aplicar qualquer mudança.
Não execute nenhuma ação que possa causar erro em produção ou impedir que o projeto rode localmente.