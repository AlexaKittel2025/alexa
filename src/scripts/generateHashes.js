const bcrypt = require('bcryptjs');

async function generateHashes() {
  try {
    // Gerar hashes
    const teste123Hash = await bcrypt.hash('teste123', 10);
    const demo123Hash = await bcrypt.hash('Demo123!', 10);
    
    console.log('Hash para "teste123":', teste123Hash);
    console.log('Hash para "Demo123!":', demo123Hash);
    
    // Verificar se funcionam
    const verifyTeste = await bcrypt.compare('teste123', teste123Hash);
    const verifyDemo = await bcrypt.compare('Demo123!', demo123Hash);
    
    console.log('\nVerificação:');
    console.log('teste123 válido?', verifyTeste);
    console.log('Demo123! válido?', verifyDemo);
  } catch (error) {
    console.error('Erro:', error);
  }
}

generateHashes();