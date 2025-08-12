# 📝 API Lista de Tarefas 

Uma API REST completa para gerenciamento de tarefas com autenticação JWT, construída com Node.js, Express e Prisma.

## 📚 Índice

- [O que é esta API?](#o-que-é-esta-api)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Conceitos Fundamentais](#conceitos-fundamentais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar a API](#como-usar-a-api)
- [Exemplos Práticos](#exemplos-práticos)
- [Testes](#testes)
- [Segurança](#segurança)
- [Banco de Dados](#banco-de-dados)

## 🎯 O que é esta API?

Esta é uma **API REST** (Representational State Transfer) que permite:
- ✅ Criar, listar, atualizar e deletar tarefas (CRUD)
- 🔐 Sistema de autenticação com JWT (JSON Web Tokens)
- 👤 Cadastro e login de usuários
- 🔄 Refresh tokens para renovação automática de sessões
- 📊 Paginação e filtros nas listagens
- ⚡ Rate limiting para proteção contra spam
- 🧪 Testes automatizados

### O que significa API REST?

**REST** é um estilo arquitetural que define como sistemas web devem se comunicar:
- **Stateless**: Cada requisição é independente
- **HTTP Methods**: GET (buscar), POST (criar), PATCH (atualizar), DELETE (remover)
- **Status Codes**: 200 (sucesso), 404 (não encontrado), 500 (erro servidor)
- **JSON**: Formato padrão para troca de dados

## 🛠️ Tecnologias Utilizadas

### Backend Core
- **Node.js**: Runtime JavaScript no servidor
- **Express.js**: Framework web minimalista e flexível
- **JavaScript**: Linguagem de programação principal

### Banco de Dados
- **Prisma**: ORM (Object-Relational Mapping) moderno
- **SQLite**: Banco de dados leve para desenvolvimento

### Autenticação & Segurança
- **JWT (jsonwebtoken)**: Tokens para autenticação
- **bcrypt**: Hash seguro de senhas
- **express-rate-limit**: Proteção contra spam

### Validação & Middleware
- **Zod**: Validação de dados com TypeScript-like schemas
- **CORS**: Permite requisições de diferentes origens
- **Morgan**: Logger de requisições HTTP
- **Cookie-parser**: Manipulação de cookies

### Desenvolvimento & Testes
- **Nodemon**: Reinicialização automática em desenvolvimento
- **Vitest**: Framework de testes rápido
- **Supertest**: Testes de APIs HTTP
- **Cross-env**: Variáveis de ambiente multiplataforma

## 🧠 Conceitos Fundamentais

### 1. **ORM (Object-Relational Mapping)**
```javascript
// Ao invés de escrever SQL puro:
// SELECT * FROM users WHERE email = 'user@email.com'

// Usamos o Prisma (ORM):
const user = await prisma.user.findUnique({
  where: { email: 'user@email.com' }
});
```

### 2. **JWT (JSON Web Tokens)**
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE2MzM5ODc2MDB9.signature
```
- **Header**: Tipo do token e algoritmo
- **Payload**: Dados do usuário (não sensíveis)
- **Signature**: Verificação de integridade

### 3. **Middleware**
Funções que executam entre a requisição e resposta:
```javascript
// Middleware de autenticação
app.use('/todos', auth); // Verifica token antes de acessar todos
```

### 4. **Hash de Senhas**
```javascript
// Nunca armazenar senha em texto puro
const plainPassword = "123456";
const hashedPassword = await bcrypt.hash(plainPassword, 10);
// Resultado: $2b$10$N9qo8uLOickgx2ZMRZoMye...
```

## 📁 Estrutura do Projeto

```
API-lista-de-tarefas/
├── prisma/                    # Configuração do banco
│   ├── schema.prisma         # Definição das tabelas
│   ├── migrations/           # Histórico de mudanças no BD
│   └── dev.db               # Arquivo do banco SQLite
├── src/
│   ├── controllers/         # Lógica de negócio
│   │   ├── authController.js    # Login, registro, logout
│   │   └── todoController.js    # CRUD de tarefas
│   ├── middlewares/         # Funções intermediárias
│   │   ├── auth.js             # Verificação de JWT
│   │   └── rate.js             # Limitação de requisições
│   ├── routes/              # Definição das rotas
│   │   ├── auth.js             # Rotas de autenticação
│   │   └── todos.js            # Rotas de tarefas
│   ├── schemas/             # Validação de dados
│   │   ├── auth.js             # Validação login/registro
│   │   └── todo.js             # Validação de tarefas
│   ├── lib/                 # Utilitários
│   │   ├── prisma.js           # Conexão com banco
│   │   └── tokens.js           # Geração de JWT
│   ├── app.js               # Configuração do Express
│   └── server.js            # Inicialização do servidor
├── tests/                   # Testes automatizados
├── .env                     # Variáveis de ambiente
└── package.json            # Dependências e scripts
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- **Node.js** (versão 18+)
- **npm** ou **yarn**
- **Git**

### Passo a Passo

1. **Clone o repositório**
```bash
# Linux/macOS
git clone https://github.com/Natalia-Chaves/API-lista-de-tarefas.git
cd API-lista-de-tarefas

# Windows (Command Prompt)
git clone https://github.com/Natalia-Chaves/API-lista-de-tarefas.git
cd API-lista-de-tarefas
```

2. **Instale as dependências**
```bash
# Linux/macOS/Windows
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Linux/macOS - Criar arquivo .env
cat > .env << EOF
PORT=3000
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
DATABASE_URL="file:./dev.db"
REFRESH_SECRET=seu_refresh_secret_aqui
REFRESH_TTL_DAYS=7
EOF

# Windows (Command Prompt) - Criar arquivo .env
echo PORT=3000 > .env
echo JWT_SECRET=seu_jwt_secret_super_seguro_aqui >> .env
echo DATABASE_URL="file:./dev.db" >> .env
echo REFRESH_SECRET=seu_refresh_secret_aqui >> .env
echo REFRESH_TTL_DAYS=7 >> .env

# Ou crie manualmente o arquivo .env com o conteúdo:
# PORT=3000
# JWT_SECRET=seu_jwt_secret_super_seguro_aqui
# DATABASE_URL="file:./dev.db"
# REFRESH_SECRET=seu_refresh_secret_aqui
# REFRESH_TTL_DAYS=7
```

4. **Configure o banco de dados**
```bash
# Linux/macOS/Windows - Gera o cliente Prisma
npx prisma generate

# Executa as migrações (cria as tabelas)
npx prisma migrate deploy

# (Opcional) Visualizar banco no navegador
npx prisma studio
```

5. **Inicie o servidor**
```bash
# Linux/macOS/Windows - Desenvolvimento (reinicia automaticamente)
npm run dev

# Produção
npm start
```

A API estará rodando em `http://localhost:3000`

### Interface Web
A API inclui uma interface web simples acessível em `http://localhost:3000` que permite:
- Cadastro e login de usuários
- Criação, visualização e gerenciamento de tarefas
- Interface responsiva para desktop e mobile

## 🚀 Como Usar a API

### Endpoints Disponíveis

#### 🔐 Autenticação (`/auth`)
- `POST /auth/register` - Cadastrar usuário
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Dados do usuário logado
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Fazer logout

#### 📝 Tarefas (`/todos`)
- `POST /todos` - Criar tarefa
- `GET /todos` - Listar tarefas
- `GET /todos/:id` - Buscar tarefa específica
- `PATCH /todos/:id` - Atualizar tarefa
- `DELETE /todos/:id` - Deletar tarefa

### Headers Necessários
```
Content-Type: application/json
Authorization: Bearer SEU_JWT_TOKEN_AQUI
```

## 💡 Exemplos Práticos

### 1. Cadastrar um Usuário

**Requisição:**
```bash
# Linux/macOS
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Windows (Command Prompt)
curl -X POST http://localhost:3000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{
    \"name\": \"João Silva\",
    \"email\": \"joao@email.com\",
    \"password\": \"senha123\"
  }"

# Windows (PowerShell)
Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "id": 1,
  "email": "joao@email.com",
  "name": "João Silva",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Fazer Login

**Requisição:**
```bash
# Linux/macOS
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Windows (Command Prompt)
curl -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{
    \"email\": \"joao@email.com\",
    \"password\": \"senha123\"
  }"
```

**Resposta:**
```json
{
  "token_type": "Bearer",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_expires_at": "2024-01-22T10:30:00.000Z",
  "user": {
    "id": 1,
    "email": "joao@email.com",
    "name": "João Silva"
  }
}
```

### 3. Criar uma Tarefa

**Requisição:**
```bash
# Linux/macOS
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Estudar Node.js",
    "priority": 1,
    "dueDate": "2024-01-20T18:00:00.000Z"
  }'

# Windows (Command Prompt)
curl -X POST http://localhost:3000/todos ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI" ^
  -d "{
    \"title\": \"Estudar Node.js\",
    \"priority\": 1,
    \"dueDate\": \"2024-01-20T18:00:00.000Z\"
  }"
```

**Resposta:**
```json
{
  "id": 1,
  "title": "Estudar Node.js",
  "completed": false,
  "priority": 1,
  "dueDate": "2024-01-20T18:00:00.000Z",
  "createdAt": "2024-01-15T10:35:00.000Z"
}
```

### 4. Listar Tarefas com Filtros

**Requisição:**
```bash
# Linux/macOS
curl "http://localhost:3000/todos?completed=false&priority=1&page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Windows (Command Prompt)
curl "http://localhost:3000/todos?completed=false&priority=1&page=1&limit=10" ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Estudar Node.js",
      "completed": false,
      "priority": 1,
      "dueDate": "2024-01-20T18:00:00.000Z",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "pages": 1,
  "sort": "createdAt",
  "order": "desc"
}
```

### 5. Atualizar uma Tarefa

**Requisição:**
```bash
# Linux/macOS
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "completed": true,
    "title": "Estudar Node.js - Concluído!"
  }'

# Windows (Command Prompt)
curl -X PATCH http://localhost:3000/todos/1 ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI" ^
  -d "{
    \"completed\": true,
    \"title\": \"Estudar Node.js - Concluído!\"
  }"
```

### 6. Deletar uma Tarefa

**Requisição:**
```bash
# Linux/macOS
curl -X DELETE http://localhost:3000/todos/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Windows (Command Prompt)
curl -X DELETE http://localhost:3000/todos/1 ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:** Status 204 (No Content)

## 🧪 Testes

### Executar Testes
```bash
# Linux/macOS/Windows - Executar todos os testes
npm test

# Executar testes em modo watch (observa mudanças)
npm run test:watch

# Executar testes com Vitest diretamente
npm run vitest
```

### Estrutura dos Testes
```javascript
// Exemplo de teste de autenticação
describe('POST /auth/register', () => {
  it('deve cadastrar um novo usuário', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'Teste User',
        email: 'teste@email.com',
        password: 'senha123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.email).toBe('teste@email.com');
  });
});
```

### Por que Testar?
- ✅ **Confiabilidade**: Garante que o código funciona
- 🐛 **Detecção de Bugs**: Encontra problemas antes da produção
- 🔄 **Refatoração Segura**: Permite mudanças sem medo
- 📖 **Documentação**: Testes servem como exemplos de uso

## 🔒 Segurança

### 1. **Hash de Senhas**
```javascript
// ❌ NUNCA faça isso:
const user = { password: "123456" };

// ✅ Sempre use hash:
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. **JWT Tokens**
- **Access Token**: Curta duração (15 minutos)
- **Refresh Token**: Longa duração (7 dias)
- **Rotação**: Refresh tokens são renovados a cada uso

### 3. **Rate Limiting**
```javascript
// Limita tentativas de login
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  limit: 10, // máximo 10 tentativas
});
```

### 4. **Validação de Dados**
```javascript
// Usando Zod para validar entrada
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});
```

### 5. **CORS (Cross-Origin Resource Sharing)**
```javascript
// Permite requisições de diferentes domínios
app.use(cors());
```

## 🗄️ Banco de Dados

### Modelo de Dados (Prisma Schema)

```prisma
model User {
  id           Int            @id @default(autoincrement())
  email        String         @unique
  password     String         // Hash bcrypt
  name         String?
  todos        Todo[]         // Relacionamento 1:N
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  RefreshToken RefreshToken[] // Tokens de refresh
}

model Todo {
  id        Int       @id @default(autoincrement())
  title     String
  completed Boolean   @default(false)
  priority  Int?      // 1=alta, 2=média, 3=baixa
  dueDate   DateTime? // Data limite opcional
  user      User      @relation(fields: [userId], references: [id])
  userId    Int       // Chave estrangeira
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([completed]) // Índice para consultas rápidas
  @@index([createdAt])
}

model RefreshToken {
  id        Int       @id @default(autoincrement())
  jti       String    @unique // JWT ID único
  token     String    // Token completo
  user      User      @relation(fields: [userId], references: [id])
  userId    Int
  userAgent String?   // Navegador/app do usuário
  ip        String?   // IP de origem
  isRevoked Boolean   @default(false) // Token revogado?
  expiresAt DateTime  // Data de expiração
  createdAt DateTime  @default(now())
  revokedAt DateTime? // Quando foi revogado

  @@index([userId])
  @@index([jti])
}
```

### Comandos Úteis do Prisma

```bash
# Linux/macOS/Windows - Visualizar banco no navegador
npx prisma studio

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Gerar cliente após mudanças no schema
npx prisma generate
```

## 📊 Monitoramento e Logs

### Morgan Logger
```javascript
// Logs automáticos de todas as requisições
app.use(morgan('dev'));
// Saída: GET /todos 200 15.234 ms - 1024
```

### Health Check
```bash
# Linux/macOS
curl http://localhost:3000/health

# Windows (Command Prompt)
curl http://localhost:3000/health

# Windows (PowerShell)
Invoke-RestMethod -Uri "http://localhost:3000/health"

# Resposta: {"ok": true, "ts": "2024-01-15T10:30:00.000Z"}
```

### Interface Web
Além dos endpoints da API, o projeto inclui uma interface web completa:
- **URL**: `http://localhost:3000`
- **Funcionalidades**: Login, registro, CRUD de tarefas
- **Tecnologia**: HTML, CSS e JavaScript vanilla
- **Responsiva**: Funciona em desktop e mobile

A interface consome a própria API e demonstra todas as funcionalidades em ação.

## 🚀 Deploy e Produção

### Variáveis de Ambiente para Produção
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=jwt_secret_super_seguro_e_longo
REFRESH_SECRET=refresh_secret_diferente_do_jwt
REFRESH_TTL_DAYS=7
DATABASE_URL="postgresql://user:pass@host:5432/dbname" # PostgreSQL em produção
```

### Checklist de Produção
- ✅ Usar HTTPS
- ✅ Configurar CORS adequadamente
- ✅ Usar PostgreSQL ao invés de SQLite
- ✅ Configurar logs estruturados
- ✅ Monitoramento de performance
- ✅ Backup automático do banco
- ✅ Rate limiting ativo

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

---

## 🎓 Conceitos Aprendidos

Ao estudar este projeto, você aprenderá:

- **Backend Development**: Como construir APIs REST
- **Autenticação**: JWT, refresh tokens, hash de senhas
- **Banco de Dados**: ORM, migrações, relacionamentos
- **Segurança**: Rate limiting, validação, CORS
- **Testes**: Testes automatizados, TDD
- **Arquitetura**: Separação de responsabilidades, middlewares
- **DevOps**: Variáveis de ambiente, deploy

Este README serve como um guia completo para entender não apenas como usar a API, mas também **por que** cada decisão técnica foi tomada e **como** implementar funcionalidades similares em seus próprios projetos.

Happy coding! 🚀