const { drizzle } = require('drizzle-orm/vercel-postgres');
const { migrate } = require('drizzle-orm/vercel-postgres/migrator');
const { sql } = require('@vercel/postgres');
const path = require('path');

async function runMigrations() {
  console.log('Iniciando aplicação de migrações...');
  
  try {
    // Configuração do cliente Drizzle
    const db = drizzle(sql);
    
    // Caminho para as migrações
    const migrationsFolder = path.join(process.cwd(), 'drizzle/migrations');
    
    // Executa as migrações
    await migrate(db, { migrationsFolder });
    
    console.log('✅ Migrações aplicadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao aplicar migrações:', error);
    process.exit(1);
  }
}

// Executa as migrações
runMigrations(); 