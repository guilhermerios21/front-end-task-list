# Task List Frontend

Frontend moderno e flexível para aplicação de lista de tarefas, desenvolvido com **React 18**, **TypeScript**, **Vite** e suporte para **múltiplos bancos de dados**.

## 🚀 Características

- ✅ **Multi-Database Support**: Funciona com MongoDB e PostgreSQL
- ✅ **Autenticação JWT**: Login/registro seguro
- ✅ **CRUD Completo**: Criar, ler, atualizar e deletar tarefas
- ✅ **Protected Routes**: Rotas protegidas com verificação de token
- ✅ **Responsive Design**: Interface adaptável para mobile e desktop
- ✅ **Toast Notifications**: Feedback visual para ações do usuário
- ✅ **TypeScript**: Tipagem estática para maior segurança
- ✅ **Vite**: Build rápido e HMR instantâneo

## 🗄️ Suporte Multi-Banco

Este frontend foi projetado para ser **agnóstico ao banco de dados**. Você escolhe qual backend usar através de **variáveis de ambiente no Vercel**:

### Configuração MongoDB
```bash
VITE_DATABASE_TYPE=mongodb
VITE_MONGODB_API_URL=https://seu-backend-mongodb.vercel.app/api
```

### Configuração PostgreSQL
```bash
VITE_DATABASE_TYPE=postgres
VITE_POSTGRES_API_URL=https://seu-backend-postgres.vercel.app/api
```

O frontend **normaliza automaticamente** as diferenças entre os bancos:
- IDs: `_id` (MongoDB) ↔ `id` (PostgreSQL)
- Campos: `camelCase` ↔ `snake_case`

📖 **Documentação completa**: [MULTI_DATABASE.md](./todo-react-frontend/MULTI_DATABASE.md)

## 🛠️ Tecnologias

- **React 18.2** - Biblioteca UI
- **TypeScript 5.3** - Tipagem estática
- **Vite 5.0** - Build tool e dev server
- **React Router 6.20** - Roteamento
- **React Toastify 9.1** - Notificações
- **JWT Decode 4.0** - Decodificação de tokens

## 📦 Instalação

```bash
cd todo-react-frontend
npm install
```

## 🔧 Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Configure as variáveis:
```bash
# Escolha o tipo de banco
VITE_DATABASE_TYPE=mongodb  # ou postgres

# Configure as URLs
VITE_MONGODB_API_URL=https://backend-mongodb.example.com/api
VITE_POSTGRES_API_URL=https://backend-postgres.example.com/api
```

## 🚀 Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

## 🏗️ Build

```bash
npm run build
```

## 📤 Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `VITE_DATABASE_TYPE` (mongodb ou postgres)
   - `VITE_MONGODB_API_URL` ou `VITE_POSTGRES_API_URL`
3. Deploy automático!

📖 **Guia completo**: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

## 📁 Estrutura do Projeto

```
todo-react-frontend/
├── src/
│   ├── components/        # Componentes React
│   │   ├── auth/         # Login, Register
│   │   ├── common/       # Header, ProtectedRoute
│   │   └── task/         # TaskList, TaskItem
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # API services
│   ├── context/          # Context API (Auth)
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   ├── utils/            # Helpers e utilitários
│   ├── config/           # Configurações
│   └── styles/           # CSS global
├── public/               # Assets estáticos
└── dist/                 # Build de produção
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. **Registro**: Cria novo usuário
2. **Login**: Retorna token JWT
3. **Token**: Armazenado no localStorage
4. **Auto-logout**: Token expirado redireciona para login
5. **Protected Routes**: Verificam token antes de renderizar

## 📝 Funcionalidades

### Gestão de Tarefas
- ✅ Criar nova tarefa
- ✅ Listar tarefas (pendentes e concluídas)
- ✅ Atualizar tarefa (título, descrição, status)
- ✅ Marcar como concluída/pendente
- ✅ Deletar tarefa

### Sistema de Status
- `pending` - Pendente
- `in_progress` - Em progresso
- `completed` - Concluída
- `cancelled` - Cancelada

### Prioridades
- `low` - Baixa
- `normal` - Normal
- `high` - Alta
- `urgent` - Urgente

## 🔄 Trocar Banco de Dados

Para trocar entre MongoDB e PostgreSQL após o deploy:

1. Acesse Vercel Dashboard → Settings → Environment Variables
2. Mude `VITE_DATABASE_TYPE` para `mongodb` ou `postgres`
3. Atualize a URL correspondente
4. Redeploy

**Sem alteração de código necessária!** 🎉

## 📚 Documentação Adicional

- [Multi-Database Support](./todo-react-frontend/MULTI_DATABASE.md)
- [Vercel Deploy Guide](./VERCEL_DEPLOY.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
