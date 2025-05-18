import pool, { testConnection } from './connection';
import { initializeDatabase } from './init';

// Função para verificar e configurar o banco de dados
export const setupDatabase = async (): Promise<boolean> => {
  try {
    // Testar a conexão
    const connectionSuccess = await testConnection();
    
    if (!connectionSuccess) {

      // Tentar inicializar o banco de dados
      await initializeDatabase();
      
      // Testar novamente a conexão
      const retryConnection = await testConnection();
      
      if (!retryConnection) {
        throw new Error('Não foi possível conectar ao banco de dados mesmo após a inicialização');
      }
      
      return true;
    }

    return true;
  } catch (error) {
    
    return false;
  }
};

// Executar a configuração se este arquivo for executado diretamente
if (require.main === module) {
  setupDatabase()
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
      // Fechar a conexão
      pool.end();
    });
}

export default setupDatabase; 