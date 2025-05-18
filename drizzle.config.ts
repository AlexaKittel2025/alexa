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
    // Configuração para PostgreSQL
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DATABASE || 'mentei_app',
    ssl: process.env.NODE_ENV === 'production' ? true : false,
  },
  // Se deve ou não verificar se tabelas existentes correspondem ao schema definido
  strict: true,
} satisfies Config; 