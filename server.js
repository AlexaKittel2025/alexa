const express = require('express');
const next = require('next');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Determinar se estamos em desenvolvimento  
const dev = process.env.NODE_ENV !== 'production';

// Se estamos em desenvolvimento e DATABASE_URL aponta para SQLite, usar schema.dev.prisma
const usingDevDB = process.env.DATABASE_URL?.startsWith('file:');

if (usingDevDB) {
  console.log('Usando banco SQLite para desenvolvimento');
  // Em desenvolvimento com SQLite, o Prisma já deve estar configurado corretamente
}

// Criando instância do Prisma com log apenas de erros
const prisma = new PrismaClient({
  log: dev ? ['error', 'warn'] : ['error'],
});

const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.BACKEND_PORT || 3001;

app.prepare().then(() => {
  const server = express();

  // Configurar CORS
  server.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || 'https://mentei-app.vercel.app' 
      : 'http://localhost:3000',
    credentials: true,
  }));
  
  // Middleware de segurança básica
  server.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  // Middleware para processar JSON
  server.use(express.json());

  // Rotas da API
  server.get('/api/users/ranking', async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          score: 'desc'
        },
        take: 10,
        select: {
          id: true,
          display_name: true,
          image: true,
          score: true
        }
      });
      res.json(users);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error.message);
      // Retornar dados de fallback apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        return res.json([
        { id: '1', display_name: 'Carlos Mendes', score: 1107, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: '2', display_name: 'Ana Beatriz', score: 984, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: '3', display_name: 'Rodrigo Lima', score: 861, image: 'https://randomuser.me/api/portraits/men/67.jpg' },
        { id: '4', display_name: 'Juliana Costa', score: 738, image: 'https://randomuser.me/api/portraits/women/12.jpg' },
        { id: '5', display_name: 'Pedro Almeida', score: 615, image: 'https://randomuser.me/api/portraits/men/23.jpg' },
      ]);
      }
      // Em produção, retorna array vazio em vez de dados falsos
      return res.status(500).json({ error: 'Erro ao buscar ranking de usuários' });
    }
  });

  // Rota de fallback para o Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Backend pronto na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao iniciar o servidor:', err);
  process.exit(1);
}); 