// Helper para trabalhar com IDs de diferentes bancos de dados
// MongoDB usa _id, PostgreSQL usa id

export const getId = (obj: any): string => {
  return obj?._id || obj?.id || '';
};

export const hasId = (obj: any): boolean => {
  return !!(obj?._id || obj?.id);
};

// Normaliza nome de campos entre snake_case (PostgreSQL) e camelCase (JavaScript)
export const normalizeField = (obj: any, camelCase: string, snakeCase: string): any => {
  return obj?.[camelCase] || obj?.[snakeCase];
};
