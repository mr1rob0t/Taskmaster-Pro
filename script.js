
// ===== JAVASCRIPT - APPLICATION LOGIC =====

// Global variables to store our data
let todos = [];
let currentFilter = 'all';
let searchTerm = '';
let todoIdCounter = 1;

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Focus on input field
    document.getElementById('todoInput').focus();

    // Add enter key listener for adding todos
    document.getElementById('todoInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Initialize with some sample data for demo
    initializeSampleData();

    // Render the initial state
    renderTodos();
    updateStats();
});

// Function to add sample data for demonstration
function initializeSampleData() {
    const sampleTodos = [
        {
            id: todoIdCounter++,
            text: "Welcome to TaskMaster Pro! 🎉",
            completed: false,
            priority: "high",
            category: "personal",
            starred: true,
            dateCreated: new Date()
        },
        {
            id: todoIdCounter++,
            text: "Try marking this task as complete",
            completed: false,
            priority: "medium",
            category: "personal",
            starred: false,
            dateCreated: new Date(Date.now() - 86400000) // Yesterday
        }
    ];

    todos = sampleTodos;
}

// Function to add a new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const priority = document.getElementById('prioritySelect').value;
    const category = document.getElementById('categorySelect').value;
    const text = input.value.trim();

    if (text === '') {
        // Add shake animation to input if empty
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
        return;
    }

    // Create new todo object
    const newTodo = {
        id: todoIdCounter++,
        text: text,
        completed: false,
        priority: priority,
        category: category,
        starred: false,
        dateCreated: new Date()
    };

    // Add to beginning of array for newest first
    todos.unshift(newTodo);

    // Clear input and reset to defaults
    input.value = '';
    document.getElementById('prioritySelect').value = 'medium';
    document.getElementById('categorySelect').value = 'personal';

    // Update the display
    renderTodos();
    updateStats();

    // Focus back on input
    input.focus();
}

// Function to toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });

    renderTodos();
    updateStats();
}

// Function to delete a todo
function deleteTodo(id) {
    // Add confirmation for better UX
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
        updateStats();
    }
}

// Function to toggle star status
function toggleStar(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, starred: !todo.starred };
        }
        return todo;
    });

    renderTodos();
    updateStats();
}

// Function to edit a todo
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newText = prompt('Edit task:', todo.text);
        if (newText && newText.trim() !== '') {
            todos = todos.map(t => {
                if (t.id === id) {
                    return { ...t, text: newText.trim() };
                }
                return t;
            });
            renderTodos();
        }
    }
}

// Function to filter todos
function filterTodos(filter) {
    currentFilter = filter;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    renderTodos();
}

// Function to search todos
function searchTodos() {
    searchTerm = document.getElementById('searchInput').value.toLowerCase();
    renderTodos();
}

// Function to get filtered todos based on current filter and search
function getFilteredTodos() {
    let filtered = todos;

    // Apply filter
    switch (currentFilter) {
        case 'active':
            filtered = filtered.filter(todo => !todo.completed);
            break;
        case 'completed':
            filtered = filtered.filter(todo => todo.completed);
            break;
        case 'starred':
            filtered = filtered.filter(todo => todo.starred);
            break;
        default:
            // 'all' - no filtering needed
            break;
    }

    // Apply search
    if (searchTerm) {
        filtered = filtered.filter(todo =>
            todo.text.toLowerCase().includes(searchTerm) ||
            todo.category.toLowerCase().includes(searchTerm) ||
            todo.priority.toLowerCase().includes(searchTerm)
        );
    }

    return filtered;
}

// Function to render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <h3>No tasks found</h3>
                        <p>${currentFilter === 'all' ? 'Add your first task above!' : 'No tasks match your current filter.'}</p>
                    </div>
                `;
        return;
    }

    todoList.innerHTML = filteredTodos.map((todo, index) => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}" style="animation-delay: ${index * 0.1}s">
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
                    
                    <div class="todo-content">
                        <div class="todo-text">${escapeHtml(todo.text)}</div>
                        <div class="todo-meta">
                            <span class="priority-badge priority-${todo.priority}">${todo.priority}</span>
                            <span class="category-badge">${todo.category}</span>
                            <span class="todo-date">${formatDate(todo.dateCreated)}</span>
                        </div>
                    </div>
                    
                    <div class="todo-actions">
                        <button class="action-btn star ${todo.starred ? 'active' : ''}" onclick="toggleStar(${todo.id})" title="Star">
                            ⭐
                        </button>
                        <button class="action-btn" onclick="editTodo(${todo.id})" title="Edit">
                            ✏️
                        </button>
                        <button class="action-btn delete" onclick="deleteTodo(${todo.id})" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
            `).join('');
}

// Function to update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const starred = todos.filter(todo => todo.starred).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('starredTasks').textContent = starred;
}

// Function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to format date
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString();
}

// Function to toggle dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    // Save preference in session
    const isDark = document.body.classList.contains('dark-mode');
    sessionStorage.setItem('darkMode', isDark);
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = sessionStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// Add CSS for shake animation
const shakeCSS = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;

// Inject shake animation CSS
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Add some celebration effects when tasks are completed
function celebrateCompletion() {
    // Create confetti effect
    for (let i = 0; i < 20; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)];
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';
    confetti.style.borderRadius = '50%';

    document.body.appendChild(confetti);

    // Animate confetti falling
    let pos = -10;
    const fall = setInterval(() => {
        pos += 3;
        confetti.style.top = pos + 'px';
        confetti.style.transform = `rotate(${pos * 2}deg)`;

        if (pos > window.innerHeight) {
            clearInterval(fall);
            confetti.remove();
        }
    }, 20);
}

// Enhanced toggle function with celebration
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    const wasCompleted = todo.completed;

    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });

    // If task was just completed, celebrate!
    if (!wasCompleted && todos.find(t => t.id === id).completed) {
        celebrateCompletion();
    }

    renderTodos();
    updateStats();
}
