import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '..', 'data.sqlite'));
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  );
`);

const data = [
  { title:'Mercado', amount: 250.90, category:'Alimentação', date:'2025-10-01' },
  { title:'Uber', amount: 38.50, category:'Transporte', date:'2025-10-02' },
  { title:'Internet', amount: 99.99, category:'Moradia', date:'2025-10-03' }
];

const insert = db.prepare('INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)');
db.transaction(() => {
  for (const e of data) insert.run(e.title, e.amount, e.category, e.date);
})();
console.log('Seed concluído');
