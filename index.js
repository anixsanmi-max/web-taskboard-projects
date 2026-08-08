const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.use(session({
  secret: 'replace-this-with-a-long-random-string',
  resave: false,
  saveUninitialized: false
}));

// Blocks any request that doesn't have a logged-in session
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
}

// ---------- Auth ----------
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    const result = stmt.run(email, passwordHash);
    req.session.userId = result.lastInsertRowid;
    res.status(201).json({ id: result.lastInsertRowid, email });
  } catch (err) {
    res.status(409).json({ error: 'Email already registered' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid email or password' });

  req.session.userId = user.id;
  res.json({ message: 'Logged in', email: user.email });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

app.get('/api/me', (req, res) => {
  res.json({ loggedIn: !!req.session.userId });
});

// ---------- Boards ----------
app.get('/api/boards', requireAuth, (req, res) => {
  const boards = db.prepare('SELECT * FROM boards WHERE user_id = ?').all(req.session.userId);
  res.json(boards);
});

app.post('/api/boards', requireAuth, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const stmt = db.prepare('INSERT INTO boards (title, user_id) VALUES (?, ?)');
  const result = stmt.run(title, req.session.userId);
  res.status(201).json({ id: result.lastInsertRowid, title, user_id: req.session.userId });
});

app.delete('/api/boards/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM boards WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
  res.status(204).end();
});

// ---------- Tasks ----------
app.get('/api/boards/:boardId/tasks', requireAuth, (req, res) => {
  // Confirm the board actually belongs to this user before returning its tasks
  const board = db.prepare('SELECT * FROM boards WHERE id = ? AND user_id = ?')
    .get(req.params.boardId, req.session.userId);
  if (!board) return res.status(404).json({ error: 'Board not found' });

  const tasks = db.prepare('SELECT * FROM tasks WHERE board_id = ?').all(req.params.boardId);
  res.json(tasks);
});

app.post('/api/boards/:boardId/tasks', requireAuth, (req, res) => {
  const board = db.prepare('SELECT * FROM boards WHERE id = ? AND user_id = ?')
    .get(req.params.boardId, req.session.userId);
  if (!board) return res.status(404).json({ error: 'Board not found' });

  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const stmt = db.prepare('INSERT INTO tasks (title, board_id) VALUES (?, ?)');
  const result = stmt.run(title, req.params.boardId);
  res.status(201).json({ id: result.lastInsertRowid, title, completed: 0, board_id: Number(req.params.boardId) });
});

app.patch('/api/tasks/:id', requireAuth, (req, res) => {
  const { completed } = req.body;
  db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, req.params.id);
  res.json({ message: 'Updated' });
});

app.delete('/api/tasks/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
