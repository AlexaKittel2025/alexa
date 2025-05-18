import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { dbConfig, sqlPaths } from '../config';

// Configuração da conexão com o PostgreSQL para administrador
const adminPool = new Pool({
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  database: 'postgres', // Conexão com o banco de dados padrão para criar nosso banco
});

// Configuração da conexão com o PostgreSQL para o banco de dados do app
const appPool = new Pool({
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
});

// Função para criar o banco de dados
async function createDatabase() {
  try {
    const client = await adminPool.connect();
    
    try {
      // Verificar se o banco de dados já existe
      const checkDb = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = '${dbConfig.database}'`
      );
      
      if (checkDb.rowCount === 0) {
        // Criando o banco de dados
        await client.query(`CREATE DATABASE ${dbConfig.database}`);
        
      } else {
        
      }
    } finally {
      client.release();
    }
  } catch (error) {
    
    throw error;
  }
}

// Função para executar scripts SQL
async function executeSQL(pool: Pool, filePath: string) {
  try {
    const client = await pool.connect();
    
    try {
      const sql = fs.readFileSync(path.resolve(filePath), 'utf8');
      await client.query(sql);
      
    } finally {
      client.release();
    }
  } catch (error) {
    
    throw error;
  }
}

// Função principal para inicializar o banco de dados
async function initializeDatabase() {
  try {
    await createDatabase();
    
    // Caminho dos scripts SQL
    const schemaPath = path.join(__dirname, '..', '..', sqlPaths.schema);
    const seedPath = path.join(__dirname, '..', '..', sqlPaths.seed);
    
    // Executar schema e seed
    await executeSQL(appPool, schemaPath);
    await executeSQL(appPool, seedPath);

  } catch (error) {
    
  } finally {
    // Fechando as conexões
    adminPool.end();
    appPool.end();
  }
}

// Executar a inicialização se este arquivo for executado diretamente
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase }; 