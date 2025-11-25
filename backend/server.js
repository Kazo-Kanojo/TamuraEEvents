const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

// 1. Configuração do App
const app = express();
app.use(express.json());
app.use(cors());

// 2. Conexão com Banco de Dados
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar no SQLite:', err.message);
  } else {
    console.log('🔥 Conectado ao Banco de Dados SQLite.');
  }
});

// 3. Criação e Atualização das Tabelas
db.serialize(() => {
  // Tabela de Usuários (com colunas novas para o campeonato)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bike_number INTEGER,
    score INTEGER DEFAULT 0,
    position INTEGER DEFAULT 0
  )`);

  // Tenta adicionar as colunas caso o banco já exista (Gambiarra segura para SQLite)
  db.run("ALTER TABLE users ADD COLUMN score INTEGER DEFAULT 0", (err) => {});
  db.run("ALTER TABLE users ADD COLUMN position INTEGER DEFAULT 0", (err) => {});

  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    image TEXT,
    price REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_id INTEGER,
    category TEXT,
    status TEXT DEFAULT 'confirmed',
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(event_id) REFERENCES events(id)
  )`);
});

// --- ROTAS ---

// 1. Cadastro
app.post('/register', (req, res) => {
  const { name, email, password, bike_number } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Dados incompletos.' });

  const checkSql = `SELECT * FROM users WHERE email = ?`;
  db.get(checkSql, [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ error: 'Email já cadastrado.' });

    const sql = `INSERT INTO users (name, email, password, bike_number, score, position) VALUES (?, ?, ?, ?, 0, 0)`;
    db.run(sql, [name, email, password, bike_number], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Sucesso!', userId: this.lastID });
    });
  });
});

// 2. Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  
  db.get(sql, [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row) {
      const isAdmin = (row.email === '10tamura@gmail.com'); 
      res.json({
        message: 'Login OK!',
        user: { 
          id: row.id, 
          name: row.name, 
          email: row.email, 
          bike_number: row.bike_number,
          score: row.score,
          position: row.position,
          isAdmin: isAdmin 
        }
      });
    } else {
      res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  });
});

// 3. Rotas de Eventos
app.get('/events', (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/admin/events', (req, res) => {
  const { title, date, location, price, image } = req.body;
  const finalImage = image || "https://images.unsplash.com/photo-1599474924187-334a4ae513df?q=80&w=1920&auto=format&fit=crop";
  const sql = `INSERT INTO events (title, date, location, price, image) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [title, date, location, price, finalImage], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Evento criado!', eventId: this.lastID });
  });
});

app.delete('/admin/events/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM events WHERE id = ?`, id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Evento deletado com sucesso.' });
  });
});

// 4. Ver Inscrições e Pilotos
app.get('/admin/registrations', (req, res) => {
  const sql = `
    SELECT r.id, u.name as piloto, u.bike_number, e.title as evento, r.category
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    JOIN events e ON r.event_id = e.id
    ORDER BY e.date DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- NOVA ROTA: LISTAR TODOS OS PILOTOS (PARA DAR PONTOS) ---
app.get('/admin/users', (req, res) => {
  // Pega todos os usuários que NÃO são o admin
  const sql = "SELECT id, name, bike_number, score, position FROM users WHERE email != '10tamura@gmail.com' ORDER BY position ASC";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- NOVA ROTA: ATUALIZAR PONTOS E POSIÇÃO ---
app.put('/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const { score, position } = req.body;

  const sql = `UPDATE users SET score = ?, position = ? WHERE id = ?`;
  db.run(sql, [score, position, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Dados do piloto atualizados!' });
  });
});

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🏁 Servidor rodando em http://localhost:${PORT}`);
});