// 待辦清單的儲存名稱。
const STORAGE_KEY = 'offline-todo-list';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const emptyState = document.querySelector('#empty-state');
const remainingCount = document.querySelector('#remaining-count');

// 從 localStorage 讀取資料，資料損壞時回到空清單。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch (error) {
    return [];
  }
}

let todos = loadTodos();

// 將最新的待辦清單保存到瀏覽器。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 產生每筆待辦專用的識別碼。
function createTodoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 依照資料重新繪製畫面，避免直接插入使用者輸入的 HTML。
function renderTodos() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.className = 'todo-checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `完成待辦：${todo.text}`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除待辦：${todo.text}`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = todos.length > 0;
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

// 表單送出時新增待辦，純空白內容不會被加入。
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.push({ id: createTodoId(), text, completed: false });
  saveTodos();
  renderTodos();
  input.value = '';
  input.focus();
});

// 使用事件委派處理勾選與刪除，讓動態產生的項目也能運作。
list.addEventListener('change', (event) => {
  if (!event.target.matches('.todo-checkbox')) return;

  const item = event.target.closest('.todo-item');
  todos = todos.map((todo) => (
    todo.id === item.dataset.id
      ? { ...todo, completed: event.target.checked }
      : todo
  ));
  saveTodos();
  renderTodos();
});

list.addEventListener('click', (event) => {
  if (!event.target.matches('.delete-button')) return;

  const item = event.target.closest('.todo-item');
  todos = todos.filter((todo) => todo.id !== item.dataset.id);
  saveTodos();
  renderTodos();
});

renderTodos();