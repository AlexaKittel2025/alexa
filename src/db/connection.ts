import { Pool } from 'pg';
import { dbConfig } from '../config';

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
});

// Função para testar a conexão
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    
    client.release();
    return true;
  } catch (error) {
    
    return false;
  }
};

// Executar o teste de conexão se este arquivo for executado diretamente
if (require.main === module) {
  testConnection()
    .then(success => {
      if (success) {
        
      } else {
        
        process.exit(1);
      }
    })
    .catch(error => {
      
      process.exit(1);
    })
    .finally(() => {
      // Fechar o pool de conexões
      pool.end();
    });
}

// Exporta o pool para ser usado em outros arquivos
export default pool; 