# 📝 API Lista de Tarefas 

Uma API REST completa para gerenciamento de tarefas com autenticação JWT, construída com Node.js, Express e Prisma.

## 📚 Índice

- [O que é esta API?](#o-que-é-esta-api)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Conceitos Fundamentais](#conceitos-fundamentais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar a API](#como-usar-a-api)
- [Testando a API com Insomnia/Postman](#testando-a-api-com-insomniapostman)
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

## 🛠️ Tecnologias Utilizadas e Suas Justificativas

### Backend Core

#### **Node.js** - Runtime JavaScript no Servidor

- ✅ **Mesma linguagem**: JavaScript tanto no front quanto no back-end
- ✅ **Performance**: Event-loop não-bloqueante, ideal para I/O intensivo
- ✅ **Ecossistema**: NPM com milhões de pacotes disponíveis
- ✅ **Comunidade**: Grande suporte e documentação
- ✅ **Rapidez de desenvolvimento**: Prototipagem rápida


#### **Express.js** - Framework Web Minimalista

- ✅ **Simplicidade**: Curva de aprendizado baixa
- ✅ **Flexibilidade**: Não impõe estrutura rígida
- ✅ **Middleware**: Sistema poderoso de middlewares
- ✅ **Maturidade**: Framework estável e testado
- ✅ **Documentação**: Excelente documentação oficial


### Banco de Dados

#### **Prisma** - ORM Moderno
- ✅ **Type Safety**: Tipagem automática baseada no schema
- ✅ **Developer Experience**: Autocompletar e IntelliSense
- ✅ **Migrações**: Sistema automático de versionamento do BD
- ✅ **Query Builder**: Sintaxe intuitiva e legível
- ✅ **Prisma Studio**: Interface visual para o banco

**Exemplo prático:**
```javascript
// Sem ORM (SQL puro) - propenso a erros
const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);

// Com Prisma - type-safe e intuitivo
const user = await prisma.user.findUnique({ where: { email } });
```

#### **SQLite** - Banco Leve para Desenvolvimento
- ✅ **Zero configuração**: Não precisa instalar servidor de BD
- ✅ **Portabilidade**: Arquivo único, fácil de compartilhar
- ✅ **Desenvolvimento**: Ideal para prototipagem e testes
- ✅ **Simplicidade**: Perfeito para projetos pequenos/médios
- ✅ **Compatibilidade**: Fácil migração para PostgreSQL/MySQL

### Autenticação & Segurança

#### **JWT (JSON Web Tokens)** - Autenticação Stateless

- ✅ **Stateless**: Servidor não precisa armazenar sessões
- ✅ **Escalabilidade**: Funciona bem em arquiteturas distribuídas
- ✅ **Padrão da indústria**: Amplamente adotado
- ✅ **Flexibilidade**: Pode carregar dados do usuário no payload
- ✅ **Cross-domain**: Funciona entre diferentes domínios

**Estrutura do JWT:**
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature
```

#### **bcrypt** - Hash Seguro de Senhas
- ✅ **Segurança**: Algoritmo comprovadamente seguro
- ✅ **Salt automático**: Protege contra rainbow tables
- ✅ **Custo adaptável**: Pode aumentar complexidade com o tempo
- ✅ **Padrão da indústria**: Usado por grandes empresas
- ✅ **Resistente a força bruta**: Intencionalmente lento

**Exemplo de segurança:**
```javascript
// ❌ NUNCA faça isso:
const user = { password: "123456" };

// ✅ Sempre use hash:
const hash = await bcrypt.hash("123456", 10);
// Resultado: $2b$10$N9qo8uLOickgx2ZMRZoMye...
```

#### **express-rate-limit** - Proteção Contra Spam

- ✅ **Proteção DDoS**: Limita requisições por IP/usuário
- ✅ **Flexibilidade**: Diferentes limites para diferentes rotas
- ✅ **Configurável**: Janelas de tempo e limites customizáveis
- ✅ **Integração**: Funciona perfeitamente com Express
- ✅ **Produção**: Essencial para APIs públicas

**Exemplo de uso:**
```javascript
// Limita login a 10 tentativas por 5 minutos
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  limit: 10, // máximo 10 tentativas
});
```

### Validação & Middleware

#### **Zod** - Validação de Dados TypeScript-like

- ✅ **Type Safety**: Inferência automática de tipos
- ✅ **Runtime Validation**: Valida dados em tempo de execução
- ✅ **Mensagens claras**: Erros descritivos e úteis
- ✅ **Composição**: Schemas reutilizáveis e combináveis
- ✅ **Performance**: Validação rápida e eficiente

**Exemplo prático:**
```javascript
const userSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter 6+ caracteres"),
  name: z.string().optional()
});

// Validação automática com mensagens claras
const result = userSchema.safeParse(userData);
```

#### **CORS** - Cross-Origin Resource Sharing

- ✅ **Segurança**: Controla quais domínios podem acessar a API
- ✅ **Flexibilidade**: Configuração granular por rota
- ✅ **Padrão web**: Implementa especificação oficial do W3C
- ✅ **Desenvolvimento**: Facilita integração com frontends
- ✅ **Produção**: Essencial para APIs públicas

**Por que é necessário:**
```javascript
// Sem CORS: navegador bloqueia requisições de outros domínios
// Com CORS: permite frontend (localhost:3001) acessar API (localhost:3000)
app.use(cors()); // Permite todas as origens (desenvolvimento)
```

#### **Morgan** - Logger de Requisições HTTP
- ✅ **Debugging**: Facilita identificação de problemas
- ✅ **Monitoramento**: Acompanha performance da API
- ✅ **Auditoria**: Registra todas as requisições
- ✅ **Formatos**: Vários formatos de log predefinidos
- ✅ **Integração**: Funciona perfeitamente com Express

**Exemplo de saída:**
```
GET /todos 200 15.234 ms - 1024
POST /auth/login 401 5.123 ms - 45
```

### Desenvolvimento & Testes

#### **Nodemon** - Reinicialização Automática
- ✅ **Produtividade**: Reinicia servidor automaticamente
- ✅ **Desenvolvimento**: Essencial para desenvolvimento ágil
- ✅ **Configurável**: Pode ignorar arquivos específicos
- ✅ **Zero config**: Funciona out-of-the-box
- ✅ **Padrão**: Usado pela maioria dos projetos Node.js

**Sem nodemon:** Precisa parar e iniciar servidor manualmente a cada mudança
**Com nodemon:** Mudanças são refletidas automaticamente


#### **Vitest** - Framework de Testes Rápido

- ✅ **Performance**: Execução paralela e cache inteligente
- ✅ **Compatibilidade**: API similar ao Jest
- ✅ **Vite integration**: Aproveita o bundler Vite
- ✅ **TypeScript**: Suporte nativo sem configuração
- ✅ **Watch mode**: Re-executa testes automaticamente

**Comparação de performance:**
```
Jest: ~2.5s para executar 50 testes
Vitest: ~0.8s para executar 50 testes
```

#### **Supertest** - Testes de APIs HTTP
- ✅ **Integração**: Testa a API completa (end-to-end)
- ✅ **Simplicidade**: API fluente e intuitiva
- ✅ **Assertions**: Validações built-in para HTTP
- ✅ **Mocking**: Não precisa de servidor real
- ✅ **Padrão**: Amplamente usado para testar APIs Express

**Exemplo de teste:**
```javascript
const response = await request(app)
  .post('/auth/login')
  .send({ email: 'test@test.com', password: '123456' })
  .expect(200)
  .expect('Content-Type', /json/);
```

#### **Cross-env** - Variáveis de Ambiente Multiplataforma
- ✅ **Compatibilidade**: Funciona em Windows, Linux e macOS
- ✅ **Simplicidade**: Uma linha resolve problemas de OS
- ✅ **Confiabilidade**: Elimina erros relacionados ao sistema
- ✅ **Padrão**: Usado pela maioria dos projetos Node.js
- ✅ **Zero config**: Funciona imediatamente

**Problema que resolve:**
```bash
# ❌ Não funciona no Windows:
NODE_ENV=test npm test

# ✅ Funciona em todos os sistemas:
cross-env NODE_ENV=test npm test
```

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

1. **Instale as dependências**
```bash
# Linux/macOS/Windows
npm install
```

2. **Configure as variáveis de ambiente**
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

3. **Configure o banco de dados**
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

**Interface Web**: Acesse `http://localhost:3000` para usar a interface gráfica que consome a API.

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

## 🧪 Testando a API com Insomnia/Postman

### Configuração Inicial

1. **Baixe e instale:**
   - [Insomnia](https://insomnia.rest/download) (recomendado)
   - [Postman](https://www.postman.com/downloads/)

2. **Inicie a API:**
```bash
npm run dev
```

3. **Base URL:** `http://localhost:3000`

### Fluxo de Teste Completo

#### 1. **Registrar Usuário**
- **Método:** `POST`
- **URL:** `http://localhost:3000/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "name": "Teste User",
    "email": "teste@email.com",
    "password": "senha123"
  }
  ```

#### 2. **Fazer Login**
- **Método:** `POST`
- **URL:** `http://localhost:3000/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "email": "teste@email.com",
    "password": "senha123"
  }
  ```
- **⚠️ IMPORTANTE:** Copie o `access_token` da resposta!

#### 3. **Criar Tarefa** (Requer Token)
- **Método:** `POST`
- **URL:** `http://localhost:3000/todos`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
  ```
- **Body (JSON):**
  ```json
  {
    "title": "Minha primeira tarefa",
    "priority": 1
  }
  ```

#### 4. **Listar Tarefas** (Requer Token)
- **Método:** `GET`
- **URL:** `http://localhost:3000/todos`
- **Headers:**
  ```
  Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
  ```

#### 5. **Atualizar Tarefa** (Requer Token)
- **Método:** `PATCH`
- **URL:** `http://localhost:3000/todos/1` (substitua 1 pelo ID da tarefa)
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
  ```
- **Body (JSON):**
  ```json
  {
    "completed": true,
    "title": "Tarefa concluída!"
  }
  ```

#### 6. **Deletar Tarefa** (Requer Token)
- **Método:** `DELETE`
- **URL:** `http://localhost:3000/todos/1`
- **Headers:**
  ```
  Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
  ```

### Dicas para Insomnia/Postman

#### **Variáveis de Ambiente:**
1. Crie uma variável `base_url` = `http://localhost:3000`
2. Crie uma variável `token` para armazenar o access_token
3. Use `{{base_url}}` e `{{token}}` nas requisições

#### **Automatizar Token:**
- No Postman: Use "Tests" para extrair o token automaticamente
- No Insomnia: Use "Response" > "Body Attribute" para capturar o token

#### **Collection/Workspace:**
Crie uma coleção com todas as requisições organizadas:
```
📁 API Lista de Tarefas
├── 🔐 Auth
│   ├── Register
│   ├── Login
│   ├── Me
│   ├── Refresh
│   └── Logout
└── 📝 Todos
    ├── Create Todo
    ├── List Todos
    ├── Get Todo
    ├── Update Todo
    └── Delete Todo
```

### Status Codes Esperados
- ✅ **200**: Sucesso (GET, PATCH)
- ✅ **201**: Criado (POST register, POST todos)
- ✅ **204**: Sem conteúdo (DELETE)
- ❌ **400**: Dados inválidos
- ❌ **401**: Não autorizado (token inválido/ausente)
- ❌ **404**: Não encontrado
- ❌ **409**: Conflito (email já existe)
- ❌ **429**: Muitas requisições (rate limit)
- ❌ **500**: Erro interno do servidor

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
Além dos endpoints da API, o projeto inclui uma interface web simples:
- **URL**: `http://localhost:3000`
- **Arquivos**: `public/index.html` e `public/app.js`
- **Funcionalidades**: 
  - Cadastro de novos usuários
  - Login com persistência de sessão
  - Criação de tarefas com prioridade
  - Marcação de tarefas como concluídas
  - Exclusão de tarefas
  - Mensagens de feedback amigáveis
- **Tecnologia**: HTML semântico e JavaScript vanilla
- **Persistência**: Usa localStorage para manter usuário logado

#### Como Usar a Interface:
1. Acesse `http://localhost:3000` após iniciar o servidor
2. **Primeiro acesso**: Crie uma conta no formulário "Criar Conta"
3. **Login**: Use suas credenciais no formulário "Entrar"
4. **Gerenciar tarefas**: Adicione, marque como concluída ou exclua tarefas
5. **Sessão**: Permanece logado mesmo após recarregar a página

A interface consome diretamente a API REST e demonstra todas as funcionalidades em ação.

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

## 🎓 Conceitos Aprendidos

Ao estudar este projeto, você aprenderá:

- **Backend Development**: Como construir APIs REST
- **Autenticação**: JWT, refresh tokens, hash de senhas
- **Banco de Dados**: ORM, migrações, relacionamentos
- **Segurança**: Rate limiting, validação, CORS
- **Testes**: Testes automatizados, TDD
- **Arquitetura**: Separação de responsabilidades, middlewares
- **DevOps**: Variáveis de ambiente, deploy

## 🎯 Resumo das Decisões Técnicas

### **Critérios de Escolha:**
1. **Simplicidade**: Tecnologias com curva de aprendizado baixa
2. **Maturidade**: Ferramentas testadas e estáveis
3. **Comunidade**: Suporte ativo e documentação rica
4. **Performance**: Adequadas para APIs REST
5. **Segurança**: Práticas comprovadas da indústria
6. **Produtividade**: Aceleram o desenvolvimento
7. **Escalabilidade**: Suportam crescimento futuro

### **Stack Resultante:**
```
🏗️ Arquitetura: API REST Stateless
🖥️ Runtime: Node.js (JavaScript)
🌐 Framework: Express.js (minimalista)
🗄️ Banco: SQLite → PostgreSQL (produção)
🔧 ORM: Prisma (type-safe)
🔐 Auth: JWT + bcrypt
✅ Validação: Zod (runtime + types)
🛡️ Segurança: Rate limiting + CORS
🧪 Testes: Vitest + Supertest
📊 Logs: Morgan (HTTP logging)
```

### **Benefícios da Stack:**
- ✅ **Desenvolvimento rápido**: Setup em minutos
- ✅ **Type safety**: Menos bugs em produção
- ✅ **Segurança**: Práticas modernas implementadas
- ✅ **Manutenibilidade**: Código limpo e organizado
- ✅ **Escalabilidade**: Pronta para crescer
- ✅ **Testabilidade**: Cobertura completa de testes

Este README serve como um guia completo para entender não apenas como usar a API, mas também **por que** cada decisão técnica foi tomada e **como** implementar funcionalidades similares em seus próprios projetos.

