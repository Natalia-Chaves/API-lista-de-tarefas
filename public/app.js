// API Configuration
const API = window.location.origin;
let token = localStorage.getItem('token');

// DOM Elements
const authSection = document.getElementById('auth');
const appSection = document.getElementById('app');
const userInfo = document.getElementById('user');
const todosList = document.getElementById('todos');
const messageDiv = document.getElementById('message');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    if (token) {
        showApp();
        loadTodos();
    } else {
        showAuth();
    }
    
    // Form event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('todoForm').addEventListener('submit', handleAddTodo);
});

// Show/Hide sections
function showAuth() {
    authSection.style.display = 'block';
    appSection.style.display = 'none';
}

function showApp() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    userInfo.textContent = `Olá, ${user.name || user.email}!`;
}

// Display messages
function showMessage(text, isError = false) {
    messageDiv.textContent = text;
    messageDiv.style.color = isError ? 'red' : 'green';
    setTimeout(() => messageDiv.textContent = '', 3000);
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        });
        
        if (res.ok) {
            showMessage('Usuário registrado! Agora faça login.');
            e.target.reset();
        } else {
            const error = await res.json();
            showMessage(getErrorMessage(error.error), true);
        }
    } catch (err) {
        showMessage('Erro de conexão', true);
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        });
        
        if (res.ok) {
            const data = await res.json();
            token = data.access_token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showApp();
            loadTodos();
            showMessage('Login realizado com sucesso!');
        } else {
            const error = await res.json();
            showMessage(getErrorMessage(error.error), true);
        }
    } catch (err) {
        showMessage('Erro de conexão', true);
    }
}

// Handle add todo
async function handleAddTodo(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const todoData = {
        title: formData.get('title'),
        priority: parseInt(formData.get('priority'))
    };
    
    try {
        const res = await fetch(`${API}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(todoData)
        });
        
        if (res.ok) {
            e.target.reset();
            loadTodos();
            showMessage('Tarefa adicionada!');
        } else {
            showMessage('Erro ao adicionar tarefa', true);
        }
    } catch (err) {
        showMessage('Erro de conexão', true);
    }
}

// Load todos
async function loadTodos() {
    try {
        const res = await fetch(`${API}/todos`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        
        if (res.ok) {
            const data = await res.json();
            displayTodos(data.items);
        } else if (res.status === 401) {
            logout();
        }
    } catch (err) {
        showMessage('Erro ao carregar tarefas', true);
    }
}

// Display todos
function displayTodos(todos) {
    todosList.innerHTML = '';
    
    if (todos.length === 0) {
        todosList.innerHTML = '<li>Nenhuma tarefa encontrada</li>';
        return;
    }
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id}, this.checked)">
            <span style="${todo.completed ? 'text-decoration: line-through' : ''}">${todo.title}</span>
            <small>(Prioridade: ${todo.priority})</small>
            <button onclick="deleteTodo(${todo.id})">Excluir</button>
        `;
        todosList.appendChild(li);
    });
}

// Toggle todo completion
async function toggleTodo(id, completed) {
    try {
        await fetch(`${API}/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({completed})
        });
        loadTodos();
    } catch (err) {
        showMessage('Erro ao atualizar tarefa', true);
    }
}

// Delete todo
async function deleteTodo(id) {
    if (!confirm('Excluir esta tarefa?')) return;
    
    try {
        await fetch(`${API}/todos/${id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`}
        });
        loadTodos();
        showMessage('Tarefa excluída!');
    } catch (err) {
        showMessage('Erro ao excluir tarefa', true);
    }
}

// Logout
function logout() {
    token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAuth();
    showMessage('Logout realizado');
}

// Get user-friendly error messages
function getErrorMessage(error) {
    const messages = {
        'EmailAlreadyUsed': 'E-mail já cadastrado',
        'InvalidCredentials': 'E-mail ou senha incorretos',
        'ValidationError': 'Dados inválidos'
    };
    return messages[error] || 'Erro desconhecido';
}