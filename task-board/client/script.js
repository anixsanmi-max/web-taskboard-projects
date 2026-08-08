const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const authError = document.getElementById('auth-error');

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed');
  }
  return res.status === 204 ? null : res.json();
}

async function checkAuth() {
  const { loggedIn } = await api('/api/me');
  if (loggedIn) showApp();
  else showAuth();
}

function showAuth() {
  authView.hidden = false;
  appView.hidden = true;
}

function showApp() {
  authView.hidden = true;
  appView.hidden = false;
  loadBoards();
}

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  try {
    await api('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    showApp();
  } catch (err) {
    authError.textContent = err.message;
    authError.hidden = false;
  }
});

document.getElementById('signup-btn').addEventListener('click', async () => {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  try {
    await api('/api/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
    showApp();
  } catch (err) {
    authError.textContent = err.message;
    authError.hidden = false;
  }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
  await api('/api/logout', { method: 'POST' });
  showAuth();
});

document.getElementById('add-board-btn').addEventListener('click', async () => {
  const input = document.getElementById('board-title');
  if (!input.value.trim()) return;
  await api('/api/boards', { method: 'POST', body: JSON.stringify({ title: input.value.trim() }) });
  input.value = '';
  loadBoards();
});

async function loadBoards() {
  const boards = await api('/api/boards');
  const container = document.getElementById('boards-list');
  container.innerHTML = '';

  for (const board of boards) {
    const card = document.createElement('div');
    card.className = 'board-card';

    const heading = document.createElement('h3');
    heading.innerHTML = `<span>${board.title}</span>`;
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-board';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', async () => {
      await api(`/api/boards/${board.id}`, { method: 'DELETE' });
      loadBoards();
    });
    heading.appendChild(deleteBtn);

    const taskContainer = document.createElement('div');
    taskContainer.className = 'tasks';

    const newTaskRow = document.createElement('div');
    newTaskRow.className = 'new-task';
    const taskInput = document.createElement('input');
    taskInput.placeholder = 'New task';
    const taskBtn = document.createElement('button');
    taskBtn.textContent = '+';
    taskBtn.addEventListener('click', async () => {
      if (!taskInput.value.trim()) return;
      await api(`/api/boards/${board.id}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ title: taskInput.value.trim() })
      });
      taskInput.value = '';
      renderTasks(board.id, taskContainer);
    });
    newTaskRow.append(taskInput, taskBtn);

    card.append(heading, taskContainer, newTaskRow);
    container.appendChild(card);

    renderTasks(board.id, taskContainer);
  }
}

async function renderTasks(boardId, container) {
  const tasks = await api(`/api/boards/${boardId}/tasks`);
  container.innerHTML = '';

  for (const task of tasks) {
    const row = document.createElement('div');
    row.className = 'task-row' + (task.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.completed;
    checkbox.addEventListener('change', async () => {
      await api(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: checkbox.checked })
      });
      renderTasks(boardId, container);
    });

    const span = document.createElement('span');
    span.textContent = task.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.style.background = 'none';
    deleteBtn.style.border = 'none';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', async () => {
      await api(`/api/tasks/${task.id}`, { method: 'DELETE' });
      renderTasks(boardId, container);
    });

    row.append(checkbox, span, deleteBtn);
    container.appendChild(row);
  }
}

checkAuth();
