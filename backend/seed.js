const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Dados Reais da 5ª Etapa
const events = [
  {
    title: "5ª Etapa Copa Tamura 2025",
    date: "06 e 07 de Julho - Dia Todo", // Assumi Julho baseado no "6/7"
    location: "Pista de Ibiúna - SP",
    price: 130.00, // Preço base (Adulto 1 Categoria)
    image: "https://images.unsplash.com/photo-1516226276662-31653e0811c4?q=80&w=800&auto=format&fit=crop"
  }
];

db.serialize(() => {
  db.run("DELETE FROM events"); // Limpa o banco antigo

  const stmt = db.prepare("INSERT INTO events (title, date, location, price, image) VALUES (?, ?, ?, ?, ?)");
  
  events.forEach(evt => {
    stmt.run(evt.title, evt.date, evt.location, evt.price, evt.image);
  });

  stmt.finalize();
  console.log("✅ 5ª Etapa cadastrada com sucesso!");
});

db.close();