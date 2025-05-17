# Mentei App

Uma plataforma para compartilhar e votar em histórias falsas divertidas. Mentei é uma rede social onde os usuários podem criar histórias inventadas e competir por reações.

## Funcionalidades

- Autenticação de usuários com Firebase
- Criação e visualização de postagens falsas
- Sistema de reações (Quase Acreditei, Hahaha, Mentira Épica)
- Chat global em tempo real com Ably
- Modo "Fake Post" para compartilhar mentiras baseadas em imagens
- PWA (Progressive Web App) para instalação em dispositivos móveis
- Perfis de usuário com níveis, conquistas e emblemas
- Suporte a offline com service worker

## Tecnologias

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Autenticação), PostgreSQL/Drizzle ORM (Banco de dados)
- **Real-time**: Ably para chat e funcionalidades tempo real
- **Deployment**: Vercel (recomendado)

## Configuração

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Crie um arquivo `.env.local` com base no `.env.local.example`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_ABLY_API_KEY=your-ably-api-key
   ABLY_API_KEY=your-ably-api-key
   
   # Configuração do PostgreSQL
   DATABASE_URL=postgresql://username:password@localhost:5432/mentei
   # OU use as variáveis do Vercel Postgres se estiver no ambiente Vercel
   ```
4. Configure o banco de dados:
   - Para desenvolvimento local: `npm run db:generate` para gerar as migrações
   - Em seguida: `npm run db:migrate` para aplicar as migrações
   - Para visualizar o banco de dados: `npm run db:studio`
5. Adicione os ícones para PWA na pasta `public/icons` (siga o guia em `public/icons/placeholder.txt`)
6. Execute o servidor de desenvolvimento: `npm run dev`
7. Acesse `http://localhost:3000`

## Estrutura do Projeto

- `/src/app` - Páginas e rotas da aplicação
- `/src/components` - Componentes reutilizáveis
- `/src/lib` - Bibliotecas e configurações (Firebase, Ably)
- `/src/utils` - Funções utilitárias
- `/public` - Arquivos estáticos e ícones para PWA

## Deployment

A maneira mais fácil de fazer o deploy deste app é usando a [Plataforma Vercel](https://vercel.com/new).

## Licença

MIT
