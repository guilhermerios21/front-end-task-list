# Todo App - Frontend React + TypeScript

Aplicação de lista de tarefas (TODO) com sistema completo de autenticação JWT.

## 🚀 Funcionalidades

- ✅ Cadastro e Login de usuários
- ✅ Autenticação JWT com verificação automática de expiração
- ✅ CRUD completo de tarefas
- ✅ Design responsivo
- ✅ Notificações toast
- ✅ Loading states e tratamento de erros

## 🛠️ Tecnologias

- React 18 + TypeScript
- Vite
- React Router DOM
- React Toastify
- JWT Decode
- Fetch API

## ⚙️ Como Rodar

### 1. Instalar dependências
```bash
cd todo-react-frontend
npm install
```

### 2. Configurar .env
```env
VITE_API_URL=https://backend-express.conference-ticket-guilhermerios.tech/api
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:5173

## 📱 Responsivo

Funciona perfeitamente em mobile, tablet e desktop!

## 🔐 API Backend

URL: https://backend-express.conference-ticket-guilhermerios.tech/api

Endpoints:
- POST /register
- POST /login
- GET /tasks
- POST /tasks
- PUT /tasks/:id
- PATCH /tasks/:id
- DELETE /tasks/:id
