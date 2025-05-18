const bcrypt = require('bcryptjs');

async function generateHashes() {
  try {
    // Gerar hashes
    const teste123Hash = await bcrypt.hash('teste123', 10);
    const demo123Hash = await bcrypt.hash('Demo123!', 10);

    // Verificar se funcionam
    const verifyTeste = await bcrypt.compare('teste123', teste123Hash);
    const verifyDemo = await bcrypt.compare('Demo123!', demo123Hash);

  } catch (error) {
    
  }
}

generateHashes();