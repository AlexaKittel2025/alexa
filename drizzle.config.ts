import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env.local
dotenv.config({ path: '.env.local' });

// Configuração para o Drizzle Kit
export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Usa a conexão do Vercel Postgres ou uma conexão local para desenvolvimento
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || '',
  },
  // Tabelas que devem ser ignoradas durante as migrações
  ignoreCodeblocks: [{ type: 'sql' }],
  // Se deve ou não verificar se tabelas existentes correspondem ao schema definido
  strict: true,
} satisfies Config; 