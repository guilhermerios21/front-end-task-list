# Deploy no Vercel

## Configurações no Vercel Dashboard

1. **Framework Preset**: Vite
2. **Root Directory**: `todo-react-frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

## Variáveis de Ambiente

Adicione no Vercel Dashboard (Settings → Environment Variables):

```
VITE_API_URL=/api
```

## Configuração de Rewrites

O arquivo `vercel.json` na raiz do repositório já está configurado com:
- Proxy para o backend em `/api/*`
- SPA fallback para React Router

## Notas Importantes

- O proxy `/api` redireciona para: `https://backend-express.conference-ticket-guilhermerios.tech/api`
- O arquivo `_redirects` garante que as rotas do React Router funcionem corretamente
- Certifique-se de fazer o deploy da branch `main`
