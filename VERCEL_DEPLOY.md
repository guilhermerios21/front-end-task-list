# Deploy no Vercel

## Configurações no Vercel Dashboard

1. **Framework Preset**: Vite
2. **Root Directory**: `todo-react-frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

## Variáveis de Ambiente - ESCOLHA O BANCO DE DADOS

### Opção 1: Usar MongoDB

Adicione no Vercel Dashboard (Settings → Environment Variables):

```bash
VITE_DATABASE_TYPE=mongodb
VITE_MONGODB_API_URL=https://seu-backend-mongodb.vercel.app/api
```

### Opção 2: Usar PostgreSQL

Adicione no Vercel Dashboard (Settings → Environment Variables):

```bash
VITE_DATABASE_TYPE=postgres
VITE_POSTGRES_API_URL=https://seu-backend-postgres.vercel.app/api
```

### Opção 3: URL Customizada (ignora DATABASE_TYPE)

```bash
VITE_API_URL=https://seu-backend-custom.vercel.app/api
```

### Opção 4: Usar Proxy (para mesma origem)

```bash
VITE_API_URL=/api
```

E configure o `vercel.json` com rewrites (veja abaixo).

## Como Trocar de Banco Depois do Deploy

1. Acesse seu projeto no Vercel Dashboard
2. Vá em **Settings → Environment Variables**
3. Mude `VITE_DATABASE_TYPE` de `mongodb` para `postgres` (ou vice-versa)
4. Atualize a URL correspondente (`VITE_MONGODB_API_URL` ou `VITE_POSTGRES_API_URL`)
5. Faça um **Redeploy** do projeto

## Configuração de Rewrites (Opcional)

O arquivo `vercel.json` na raiz do repositório está configurado com:
- Proxy para o backend em `/api/*` (quando usar `VITE_API_URL=/api`)
- SPA fallback para React Router

Para usar o proxy, edite `vercel.json` e configure o target para sua API:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://seu-backend.vercel.app/api/$1"
    }
  ]
}
```

## Exemplo Completo: Deploy com MongoDB

1. **Backend MongoDB**: Deploy em `https://backend-mongo.vercel.app`
2. **Variáveis no Vercel**:
   ```
   VITE_DATABASE_TYPE=mongodb
   VITE_MONGODB_API_URL=https://backend-mongo.vercel.app/api
   ```
3. **Deploy** → Pronto! ✅

## Exemplo Completo: Deploy com PostgreSQL

1. **Backend PostgreSQL**: Deploy em `https://backend-postgres.vercel.app`
2. **Variáveis no Vercel**:
   ```
   VITE_DATABASE_TYPE=postgres
   VITE_POSTGRES_API_URL=https://backend-postgres.vercel.app/api
   ```
3. **Deploy** → Pronto! ✅

## Notas Importantes

- ✅ O frontend **detecta automaticamente** o formato de dados (MongoDB ou PostgreSQL)
- ✅ Suporta IDs: `_id` (MongoDB) e `id` (PostgreSQL)
- ✅ Suporta convenções: `camelCase` e `snake_case`
- ✅ Troca de banco **sem alteração de código**, só variáveis de ambiente
- ✅ O arquivo `_redirects` garante que as rotas do React Router funcionem
- ✅ Certifique-se de fazer o deploy da branch `main`

## Múltiplos Ambientes

Você pode ter diferentes variáveis para cada ambiente:

### Production
```
VITE_DATABASE_TYPE=postgres
VITE_POSTGRES_API_URL=https://api-prod.example.com/api
```

### Preview
```
VITE_DATABASE_TYPE=mongodb
VITE_MONGODB_API_URL=https://api-staging.example.com/api
```

### Development
```
VITE_DATABASE_TYPE=mongodb
VITE_API_URL=/api
```

