const API_URL = 'http://localhost:3000';
let currentToken = localStorage.getItem('token');

// Elementos DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const todoForm = document.getElementById('todoForm');
const todosList = document.getElementById('todosList');
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const userInfo = document.getElementById('userInfo');

// Verificar se está logado ao carregar a página
if (currentToken) {
  // Verificar se o token ainda é válido
  fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${currentToken}` }
  }).then(response => {
    if (response.ok) {
      showApp();
    } else {
      // Token inválido, limpar e mostrar login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      currentToken = null;
      showAuth();
    }
  }).catch(() => {
    showAuth();
  });
} else {
  showAuth();
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      currentToken = data.access_token;
      localStorage.setItem('token', currentToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      showApp();
      loadTodos();
    } else {
      alert('Erro no login: ' + data.error);
    }
  } catch (error) {
    alert('Erro: ' + error.message);
  }
});

// Registro
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Usuário criado! Faça login.');
      registerForm.reset();
    } else {
      alert('Erro no registro: ' + data.error);
    }
  } catch (error) {
    alert('Erro: ' + error.message);
  }
});

// Criar tarefa
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('todoTitle').value;
  const priority = document.getElementById('todoPriority').value;

  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ title, priority: parseInt(priority) })
    });

    if (response.ok) {
      todoForm.reset();
      loadTodos();
    } else {
      const data = await response.json();
      alert('Erro: ' + data.error);
    }
  } catch (error) {
    alert('Erro: ' + error.message);
  }
});

// Carregar tarefas
async function loadTodos() {
  try {
    const response = await fetch(`${API_URL}/todos`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });

    if (response.ok) {
      const data = await response.json();
      displayTodos(data.items);
    } else {
      alert('Erro ao carregar tarefas');
    }
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

// Exibir tarefas
function displayTodos(todos) {
  todosList.innerHTML = '';
  todos.forEach(todo => {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    div.innerHTML = `
      <div class="todo-content">
        <span class="todo-title">${todo.title}</span>
        <span class="todo-priority">Prioridade: ${todo.priority || 'N/A'}</span>
      </div>
      <div class="todo-actions">
        <button onclick="toggleTodo(${todo.id}, ${!todo.completed})" class="btn-toggle">
          ${todo.completed ? 'Desfazer' : 'Concluir'}
        </button>
        <button onclick="deleteTodo(${todo.id})" class="btn-delete">Excluir</button>
      </div>
    `;
    todosList.appendChild(div);
  });
}

// Alternar status da tarefa
async function toggleTodo(id, completed) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ completed })
    });

    if (response.ok) {
      loadTodos();
    }
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

// Deletar tarefa
async function deleteTodo(id) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        loadTodos();
      }
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentToken = null;
  showAuth();
}

// Mostrar seção de autenticação
function showAuth() {
  authSection.style.display = 'block';
  appSection.style.display = 'none';
}

// Mostrar aplicação
function showApp() {
  authSection.style.display = 'none';
  appSection.style.display = 'block';
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  userInfo.textContent = `Olá, ${user.name || user.email}!`;
  
  loadTodos();
}

// Alternar entre login e registro
function toggleAuth() {
  const loginDiv = document.getElementById('loginDiv');
  const registerDiv = document.getElementById('registerDiv');
  const toggleText = document.querySelector('.auth-toggle p');
  
  if (loginDiv.style.display === 'none') {
    loginDiv.style.display = 'block';
    registerDiv.style.display = 'none';
    toggleText.innerHTML = 'Não tem conta? <button class="btn-link" onclick="toggleAuth()">Clique aqui para criar</button>';
  } else {
    loginDiv.style.display = 'none';
    registerDiv.style.display = 'block';
    toggleText.innerHTML = 'Já tem conta? <button class="btn-link" onclick="toggleAuth()">Clique aqui para entrar</button>';
  }
}