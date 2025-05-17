const { Pool } = require('pg');

// Configuração da conexão com o PostgreSQL
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'sosederbele',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'mentei_db'
};

const pool = new Pool({
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com o PostgreSQL estabelecida com sucesso');
    client.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o PostgreSQL:', error);
    console.log('⚠️ Continuando sem conexão com o banco de dados. Alguns recursos podem não funcionar.');
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
        console.warn('Falha no teste de conexão com o PostgreSQL. Alguns recursos podem não funcionar.');
        // Não encerramos o processo para permitir que a aplicação continue
      }
    })
    .catch(error => {
      console.error('Erro durante o teste de conexão:', error);
      console.warn('Continuando sem banco de dados. Funcionalidades limitadas.');
    });
}

// Exporta o pool para ser usado em outros arquivos
module.exports = pool; 