/**
 * Arquivo de configuração para o app
 */

// Configurações do banco de dados
export const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'sosederbele',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'mentei_db'
};

// Configurações do servidor
export const serverConfig = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Caminho para os scripts SQL
export const sqlPaths = {
  schema: 'sql/schema.sql',
  seed: 'sql/seed.sql',
  init: 'sql/init_db.sql'
};

// Configurações gerais do app
interface AppConfig {
  name: string;
  version: string;
  description: string;
  apiUrl: string;
  defaultTheme: 'light' | 'dark';
  postMaxLength: number;
  storymentMaxLength: number;
  defaultBgColors: string[];
  defaultTextColors: string[];
  postRateLimit: number; // posts por dia para usuários não-PRO
}

export const appConfig: AppConfig = {
  name: 'Mentei',
  version: '1.0.0',
  description: 'Plataforma para compartilhar mentiras criativas',
  apiUrl: 'http://localhost:3001',
  defaultTheme: 'light',
  postMaxLength: 500,
  storymentMaxLength: 280,
  defaultBgColors: [
    '#FF5A5F', // vermelho
    '#00A699', // verde
    '#FC642D', // laranja
    '#4D4D4D', // cinza escuro
    '#9669ED', // roxo
    '#2D9CDB', // azul
    '#F2C94C', // amarelo
    '#EB5757'  // rosa
  ],
  defaultTextColors: [
    '#FFFFFF', // branco
    '#4D4D4D', // cinza escuro
    '#000000'  // preto
  ],
  postRateLimit: 5
};

// Verificar e logar a URL da API para debug

// Função de utilidade para saber se estamos em ambiente de desenvolvimento
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
};

// Função para obter a URL base da API
let apiUrlOverride: string | null = null;

export const setApiUrl = (url: string): void => {
  apiUrlOverride = url;
  
};

export const getApiUrl = (): string => {
  // Se tem override, usar
  if (apiUrlOverride) {
    return apiUrlOverride;
  }
  
  // Usar a URL da API configurada, sem adicionar "/api"
  return appConfig.apiUrl;
};

// Configurações de dados persistentes
export const dataStorageConfig = {
  enablePersistence: true,
  saveIntervalMs: 5000, // Salvar automaticamente a cada 5 segundos
  storageType: 'localStorage',
  fileBasedBackup: true,
}; 