// 待辦清單的儲存名稱。
const STORAGE_KEY = 'offline-todo-list';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const emptyState = document.querySelector('#empty-state');
const remainingCount = document.querySelector('#remaining-count');
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeLabel = document.querySelector('.theme-label');
const filterButtons = document.querySelectorAll('.filter-button');

const THEME_STORAGE_KEY = 'offline-todo-theme';
const FILTER_STORAGE_KEY = 'offline-todo-filter';
const VALID_FILTERS = ['all', 'active', 'completed'];
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

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

// 讀取並驗證篩選條件，無效值一律回到全部。
function loadFilter() {
  const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
  return VALID_FILTERS.includes(savedFilter) ? savedFilter : 'all';
}

let activeFilter = loadFilter();

// 取得目前應使用的主題，沒有手動設定時跟隨作業系統。
function getCurrentTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || (systemThemeQuery.matches ? 'dark' : 'light');
}

// 套用主題並同步切換按鈕的文字與圖示。
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeLabel.textContent = isDark ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

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

  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === 'active') return !todo.completed;
    if (activeFilter === 'completed') return todo.completed;
    return true;
  });

  visibleTodos.forEach((todo) => {
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

  emptyState.hidden = visibleTodos.length > 0;
  if (todos.length === 0) {
    emptyState.textContent = '還沒有任何待辦事項,新增一個吧!';
  } else if (activeFilter === 'active') {
    emptyState.textContent = '目前沒有未完成事項。';
  } else if (activeFilter === 'completed') {
    emptyState.textContent = '目前沒有已完成事項。';
  }
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

// 切換篩選條件，只改變畫面顯示，不影響原始待辦資料。
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    localStorage.setItem(FILTER_STORAGE_KEY, activeFilter);
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });
    renderTodos();
  });
});

// 頁面載入時恢復篩選條件，並同步顯示目前選中的按鈕。
filterButtons.forEach((button) => {
  const isActive = button.dataset.filter === activeFilter;
  button.classList.toggle('active', isActive);
  button.setAttribute('aria-pressed', String(isActive));
});

// 手動切換後記住選擇；未手動設定時則保留跟隨系統的行為。
themeToggle.addEventListener('click', () => {
  const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
});

systemThemeQuery.addEventListener('change', () => {
  if (!localStorage.getItem(THEME_STORAGE_KEY)) {
    applyTheme(getCurrentTheme());
  }
});

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

applyTheme(getCurrentTheme());
renderTodos();