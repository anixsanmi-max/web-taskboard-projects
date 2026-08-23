// ---------- Theme toggle ----------
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
  body.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('habitloop-theme', theme);
}

const savedTheme = localStorage.getItem('habitloop-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ---------- Accordion ----------
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  const panel = trigger.nextElementSibling;
  panel.style.maxHeight = '0px';

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.accordion-trigger').forEach(other => {
      if (other !== trigger) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.maxHeight = '0px';
      }
    });

    trigger.setAttribute('aria-expanded', String(!isOpen));
    panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
  });
});

// ---------- Modal ----------
const modal = document.getElementById('add-habit-modal');
const openModalBtn = document.getElementById('open-add-habit');
const cancelModalBtn = document.getElementById('cancel-add-habit');
const habitForm = document.getElementById('add-habit-form');
const habitNameInput = document.getElementById('habit-name');
const habitNameError = document.getElementById('habit-name-error');

function openModal() {
  modal.hidden = false;
  habitNameInput.value = '';
  habitNameError.hidden = true;
  habitNameInput.focus();
}

function closeModal() {
  modal.hidden = true;
}

openModalBtn.addEventListener('click', openModal);
cancelModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

// ---------- Habit list (state + localStorage) ----------
const habitListEl = document.getElementById('habit-list');
const emptyStateEl = document.getElementById('empty-state');
const ringProgress = document.getElementById('ring-progress');
const ringCount = document.getElementById('ring-count');

const RING_CIRCUMFERENCE = 440;

function loadHabits() {
  try {
    return JSON.parse(localStorage.getItem('habitloop-habits')) || [];
  } catch {
    return [];
  }
}

function saveHabits(habits) {
  localStorage.setItem('habitloop-habits', JSON.stringify(habits));
}

let habits = loadHabits();

function renderHabits() {
  habitListEl.innerHTML = '';
  emptyStateEl.hidden = habits.length > 0;

  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.className = 'habit-item' + (habit.completed ? ' completed' : '');

    const name = document.createElement('span');
    name.className = 'habit-name';
    name.textContent = habit.name;

    const actions = document.createElement('div');
    actions.className = 'habit-actions';

    const completeBtn = document.createElement('button');
    completeBtn.setAttribute('aria-label', `Mark ${habit.name} complete`);
    completeBtn.textContent = habit.completed ? '✅' : '⬜';
    completeBtn.addEventListener('click', () => toggleComplete(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('aria-label', `Delete ${habit.name}`);
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => deleteHabit(index));

    actions.append(completeBtn, deleteBtn);
    li.append(name, actions);
    habitListEl.appendChild(li);
  });

  updateRing();
}

function updateRing() {
  const completedCount = habits.filter(h => h.completed).length;
  const total = habits.length || 1;
  const fraction = completedCount / total;

  ringProgress.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - fraction));
  ringCount.textContent = completedCount;
}

function toggleComplete(index) {
  habits[index].completed = !habits[index].completed;
  saveHabits(habits);
  renderHabits();
}

function deleteHabit(index) {
  habits.splice(index, 1);
  saveHabits(habits);
  renderHabits();
}

habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = habitNameInput.value.trim();

  if (name.length === 0 || name.length > 40) {
    habitNameError.hidden = false;
    habitNameInput.setAttribute('aria-invalid', 'true');
    return;
  }

  habits.push({ name, completed: false });
  saveHabits(habits);
  renderHabits();
  closeModal();
});

renderHabits();