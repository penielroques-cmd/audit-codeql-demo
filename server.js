const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// FAILLE 1 : Secret codé en dur (Hardcoded Credential)
const ADMIN_API_KEY = "AKIAIOSFODNN7EXAMPLE12345!";

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'password123')");
});

// FAILLE 2 : Injection SQL (pas de requête préparée)
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).type("text/plain").send("Identifiants invalides.");
  }

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.get(query, [username, password], (err, row) => {
    if (err) {
      return res.status(500).type("text/plain").send("Erreur interne.");
    }

    if (row) {
      return res.type("text/plain").send("Connexion réussie.");
    }

    return res.status(401).type("text/plain").send("Échec de la connexion.");
  });
});
// FAILLE 3 : Cross-Site Scripting (XSS)
app.get('/search', (req, res) => {
  const q = req.query.q;

  res.set('X-Content-Type-Options', 'nosniff');
  res.json({ recherche: q });
});
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});