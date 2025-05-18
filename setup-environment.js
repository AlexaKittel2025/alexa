const fs = require('fs');
const path = require('path');

// Verificar e criar arquivo .env.local se não existir
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  const envContent = `# Configurações do ambiente de desenvolvimento local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Banco de dados PostgreSQL
DATABASE_URL=postgresql://postgres:mentei2024@localhost:5432/mentei_db

# JWT (para autenticação)
JWT_SECRET=mentei_jwt_dev_secret_key_123456
NEXTAUTH_SECRET=mentei_jwt_dev_secret_key_123456
NEXTAUTH_URL=http://localhost:3000

# Configurações do servidor
PORT=3000
BACKEND_PORT=3001

# Firebase (deixar vazio para mock auth)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env.local criado');
} else {
  console.log('✅ Arquivo .env.local já existe');
}

console.log('✅ Ambiente configurado');
console.log('Execute: npm run dev');