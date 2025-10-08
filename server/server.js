import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// DB setup
const dbPath = path.join(__dirname, 'data.sqlite');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  );
`);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helpers
function isValidDate(d) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d);
}

// Routes
app.get('/api/expenses', (req, res) => {
  const { month } = req.query; // YYYY-MM optional
  let rows;
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    rows = db.prepare('SELECT * FROM expenses WHERE substr(date,1,7)=? ORDER BY date DESC, id DESC').all(month);
  } else {
    rows = db.prepare('SELECT * FROM expenses ORDER BY date DESC, id DESC').all();
  }
  res.json(rows);
});

app.get('/api/summary', (req, res) => {
  const month = req.query.month; // YYYY-MM
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({error:'Use ?month=YYYY-MM'});
  const total = db.prepare('SELECT SUM(amount) as total FROM expenses WHERE substr(date,1,7)=?').get(month).total || 0;
  const byCat = db.prepare('SELECT category, SUM(amount) as total FROM expenses WHERE substr(date,1,7)=? GROUP BY category ORDER BY total DESC').all(month);
  res.json({ month, total, byCategory: byCat });
});

app.post('/api/expenses', (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title or !category or typeof amount !== 'number' or !isValidDate(date)) {
    return res.status(400).json({ error: 'Campos: title, amount(number), category, date(YYYY-MM-DD)' });
  }
  const info = db.prepare('INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)').run(title, amount, category, date);
  const row = db.prepare('SELECT * FROM expenses WHERE id=?').get(info.lastInsertRowid);
  res.status(201).json(row);
});

app.put('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, amount, category, date } = req.body;
  if (!id) return res.status(400).json({error:'id inválido'});
  if (!title or !category or typeof amount !== 'number' or !isValidDate(date)) {
    return res.status(400).json({ error: 'Campos: title, amount(number), category, date(YYYY-MM-DD)' });
  }
  const info = db.prepare('UPDATE expenses SET title=?, amount=?, category=?, date=? WHERE id=?').run(title, amount, category, date, id);
  if (info.changes === 0) return res.status(404).json({error:'Não encontrado'});
  const row = db.prepare('SELECT * FROM expenses WHERE id=?').get(id);
  res.json(row);
});

app.delete('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM expenses WHERE id=?').run(id);
  if (info.changes === 0) return res.status(404).json({error:'Não encontrado'});
  res.status(204).end();
});

// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
