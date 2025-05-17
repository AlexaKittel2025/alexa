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
    console.log('Conexão com o PostgreSQL estabelecida com sucesso');
    client.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o PostgreSQL:', error);
    return false;
  }
};

// Executar o teste de conexão se este arquivo for executado diretamente
if (require.main === module) {
  testConnection()
    .then(success => {
      if (success) {
        console.log('Teste de conexão com o PostgreSQL bem-sucedido!');
      } else {
        console.error('Falha no teste de conexão com o PostgreSQL');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Erro fatal durante o teste de conexão:', error);
      process.exit(1);
    })
    .finally(() => {
      // Fechar o pool de conexões
      pool.end();
    });
}

// Exporta o pool para ser usado em outros arquivos
export default pool; 