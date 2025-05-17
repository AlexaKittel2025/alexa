import pool, { testConnection } from './connection';
import { initializeDatabase } from './init';

// Função para verificar e configurar o banco de dados
export const setupDatabase = async (): Promise<boolean> => {
  try {
    // Testar a conexão
    const connectionSuccess = await testConnection();
    
    if (!connectionSuccess) {
      console.error('Falha na conexão com o banco de dados. Iniciando processo de criação...');
      
      // Tentar inicializar o banco de dados
      await initializeDatabase();
      
      // Testar novamente a conexão
      const retryConnection = await testConnection();
      
      if (!retryConnection) {
        throw new Error('Não foi possível conectar ao banco de dados mesmo após a inicialização');
      }
      
      return true;
    }
    
    console.log('Conexão com o banco de dados bem-sucedida!');
    return true;
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    return false;
  }
};

// Executar a configuração se este arquivo for executado diretamente
if (require.main === module) {
  setupDatabase()
    .then(success => {
      if (success) {
        console.log('Banco de dados configurado com sucesso!');
      } else {
        console.error('Falha ao configurar banco de dados');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Erro fatal ao configurar banco de dados:', error);
      process.exit(1);
    })
    .finally(() => {
      // Fechar a conexão
      pool.end();
    });
}

export default setupDatabase; 