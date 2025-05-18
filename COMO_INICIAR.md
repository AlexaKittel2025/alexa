# Como Iniciar o Projeto Mentei App

## Pré-requisitos
- Node.js instalado (v18+ recomendado)
- npm ou yarn

## Passos para iniciar:

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar o banco de dados
O projeto usa SQLite em desenvolvimento, então vamos configurá-lo:

```bash
npm run setup:dev
```

Este comando irá:
- Gerar o cliente Prisma para SQLite
- Criar o banco de dados local
- Popular com dados de teste

### 3. Iniciar o projeto
```bash
npm run dev
```

### 4. Acessar a aplicação
Abra o navegador em: http://localhost:3000

## Credenciais de teste

Use uma destas contas para fazer login:

- **Usuário de teste:**
  - Email: teste@teste.com
  - Senha: teste123

- **Demo:**
  - Email: demo@demo.com
  - Senha: demo123

- **Admin:**
  - Email: admin@admin.com
  - Senha: admin123

## Resolução de problemas

### Se aparecer erro de porta em uso:
```bash
# Matar processo na porta 3000
npx kill-port 3000
```

### Se houver erro de banco de dados:
```bash
# Resetar banco de dados
rm prisma/dev.db
npm run setup:dev
```

### Para desenvolvimento com logs detalhados:
```bash
NODE_ENV=development npm run dev
```

## Estrutura do projeto

- `/src/app` - Páginas e rotas do Next.js
- `/src/components` - Componentes React
- `/src/lib` - Configurações e utilitários
- `/prisma` - Schema e configurações do banco
- `/public` - Arquivos estáticos

## Recursos disponíveis

✅ Autenticação com NextAuth
✅ Banco de dados SQLite (dev) / PostgreSQL (prod)
✅ Chat em tempo real com Ably
✅ Posts e interações
✅ Sistema de batalhas
✅ Modo escuro
✅ PWA habilitado

Bom desenvolvimento! 🚀