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

// 3. Criação das Tabelas (Garantia)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bike_number INTEGER
  )`);

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

    const sql = `INSERT INTO users (name, email, password, bike_number) VALUES (?, ?, ?, ?)`;
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
      res.json({
        message: 'Login OK!',
        user: { id: row.id, name: row.name, email: row.email, bike_number: row.bike_number }
      });
    } else {
      res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  });
});

// 3. LISTAR EVENTOS (A Rota que estava faltando!)
app.get('/events', (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 4. INSCREVER (Comprar)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  
  db.get(sql, [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row) {
      // --- AQUI ESTÁ O TRUQUE ---
      // Vamos definir um e-mail que será o ADMINISTRADOR.
      // Troque 'admin@tamura.com' pelo e-mail que você usou para cadastrar o Tamura.
      const isAdmin = (row.email === '10tamura@gmail.com'); 

      res.json({
        message: 'Login OK!',
        user: { 
          id: row.id, 
          name: row.name, 
          email: row.email, 
          bike_number: row.bike_number,
          isAdmin: isAdmin // Enviamos essa "carteirinha" pro frontend
        }
      });
    } else {
      res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  });
});

// --- ROTA: VER MINHAS INSCRIÇÕES ---
app.get('/my-registrations/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Fazemos um JOIN para pegar o nome do evento junto com a inscrição
  const sql = `
    SELECT r.id, e.title as event, r.category, r.status, e.date
    FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE r.user_id = ?
    ORDER BY r.id DESC
  `;
  
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// --- ROTA ADMIN: CRIAR NOVO EVENTO ---
app.post('/admin/events', (req, res) => {
  // Recebe os dados que vieram do formulário
  const { title, date, location, price, image } = req.body;

  // 1. Validação básica: Se faltar dado importante, avisa o erro
  if (!title || !date || !location || !price) {
    return res.status(400).json({ error: 'Preencha título, data, local e preço.' });
  }

  // 2. Define a imagem final (se o Tamura não mandar imagem, usa uma padrão de motocross)
  const finalImage = image || "https://images.unsplash.com/photo-1599474924187-334a4ae513df?q=80&w=1920&auto=format&fit=crop";

  // 3. Grava no Banco de Dados
  const sql = `INSERT INTO events (title, date, location, price, image) VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [title, date, location, price, finalImage], function(err) {
    if (err) {
      // Se der erro no banco (ex: banco travado)
      return res.status(500).json({ error: err.message });
    }
    
    // Sucesso! Devolve o ID do novo evento criado
    res.json({ 
      message: 'Evento criado com sucesso!', 
      eventId: this.lastID 
    });
  });
});

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🏁 Servidor rodando na porta http://localhost:${PORT}`);
});