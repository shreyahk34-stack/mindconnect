const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mindconnect.db');

// Ensure schema can support both anonymous and username/password users
// (This is a lightweight migration strategy that adds missing columns if needed.)
db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    anon INTEGER,
    username TEXT,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.all(`PRAGMA table_info(users)`, (err, cols) => {
    if (err || !cols) return;
    const names = cols.map(c => c.name);
    if (!names.includes('username')) {
      db.run(`ALTER TABLE users ADD COLUMN username TEXT`);
    }
    if (!names.includes('password')) {
      db.run(`ALTER TABLE users ADD COLUMN password TEXT`);
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS screenings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, type TEXT, answers TEXT, score INTEGER, category TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, counselor_id TEXT, scheduled_at TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS parents (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, name TEXT, phone TEXT, relation TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});
module.exports = db;
