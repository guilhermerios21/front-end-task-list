# Suporte Multi-Banco de Dados

Este frontend foi desenvolvido para funcionar com **MongoDB** e **PostgreSQL** de forma transparente.

## Como Funciona

### Normalização Automática de Dados

O sistema detecta e normaliza automaticamente as diferenças entre os bancos:

#### IDs
- **MongoDB**: usa `_id` (string ObjectId)
- **PostgreSQL**: usa `id` (integer ou UUID)
- **Solução**: Ambos os campos são mantidos nos objetos, garantindo compatibilidade

#### Convenções de Nomenclatura
- **MongoDB/JavaScript**: camelCase (`userId`, `createdAt`, `updatedAt`)
- **PostgreSQL**: snake_case (`user_id`, `created_at`, `updated_at`)
- **Solução**: Normalização automática nos helpers

### Arquivos Principais

#### `/src/utils/database.ts`
Funções auxiliares para trabalhar com diferentes bancos:
```typescript
getId(obj)        // Retorna o ID independente do banco (_id ou id)
hasId(obj)        // Verifica se o objeto tem um ID válido
normalizeField()  // Normaliza campos snake_case ↔ camelCase
```

#### `/src/services/api.ts`
Funções de normalização aplicadas automaticamente:
- `normalizeTask()`: Normaliza objetos Task
- `normalizeUser()`: Normaliza objetos User

### Tipos TypeScript

Os tipos foram atualizados para aceitar ambas as convenções:

```typescript
interface Task {
  _id?: string;        // MongoDB
  id?: string;         // PostgreSQL
  userId?: string;     // camelCase
  user_id?: string;    // snake_case
  createdAt?: string;  // camelCase
  created_at?: string; // snake_case
  // ...
}
```

## Uso nos Componentes

Os componentes usam o helper `getId()` para acessar IDs:

```typescript
import { getId } from '../utils/database';

// Ao invés de: task._id
// Use: getId(task)
```

## Testando com Diferentes Backends

### Backend MongoDB
```bash
VITE_API_URL=https://api-mongodb.example.com/api
```

### Backend PostgreSQL
```bash
VITE_API_URL=https://api-postgresql.example.com/api
```

O frontend funcionará com ambos sem necessidade de alterações!

## Compatibilidade

✅ MongoDB (ObjectId como string)  
✅ PostgreSQL com IDs inteiros  
✅ PostgreSQL com UUIDs  
✅ Campos em camelCase  
✅ Campos em snake_case  
✅ Respostas mistas (alguns campos em cada formato)  

## Estrutura de Resposta Esperada

Ambos os backends devem retornar:

### Login/Register
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "..." // ou "_id"
    "name": "...",
    "email": "..."
  }
}
```

### Tasks
```json
{
  "tasks": [
    {
      "id": "...",  // ou "_id"
      "title": "...",
      "status": "pending",
      // ...
    }
  ]
}
```

## Adicionando Suporte a Outros Bancos

Para adicionar suporte a outros bancos de dados:

1. Identifique as diferenças de nomenclatura
2. Atualize as interfaces em `/src/types/index.ts`
3. Adicione normalização em `/src/services/api.ts`
4. Crie helpers específicos em `/src/utils/database.ts` se necessário
