// Configuração de Banco de Dados via Variáveis de Ambiente
// Permite escolher entre MongoDB e PostgreSQL através do Vercel

// Tipo de banco: 'mongodb' ou 'postgres'
const DATABASE_TYPE = import.meta.env.VITE_DATABASE_TYPE || 'mongodb';

// URLs específicas para cada banco
const MONGODB_API_URL = import.meta.env.VITE_MONGODB_API_URL || 'https://backend-express.conference-ticket-guilhermerios.tech/api';
const POSTGRES_API_URL = import.meta.env.VITE_POSTGRES_API_URL || 'https://backend-express.conference-ticket-guilhermerios.tech/api';

// URL genérica (fallback ou custom)
const CUSTOM_API_URL = import.meta.env.VITE_API_URL;

// Determina qual URL usar baseado no tipo de banco
export const API_URL = CUSTOM_API_URL || (DATABASE_TYPE === 'postgres' ? POSTGRES_API_URL : MONGODB_API_URL);

// Exporta o tipo de banco para referência
export const DATABASE_TYPE_SELECTED = DATABASE_TYPE;

// Log para desenvolvimento (removido em produção pelo Vite)
if (import.meta.env.DEV) {
  console.log('🗄️  Database Type:', DATABASE_TYPE);
  console.log('🌐 API URL:', API_URL);
}
