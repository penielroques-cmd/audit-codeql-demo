const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// FAILLE 1 : Secret codé en dur (Hardcoded Credential)
const ADMIN_API_KEY = "AKIAIOSFODNN7EXAMPLE12345!";

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'password123')");
});

// FAILLE 2 : Injection SQL (pas de requête préparée)
app.get('/login', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
const query = "SELECT * FROM users WHERE username = ? AND password = ?";

db.get(query, [username, password], (err, row) => {
     if (row) {
res.type("text/plain").send("Connexion réussie pour " + username);
         } else {
      res.send("Échec de la connexion.");
    }
  });
});

// FAILLE 3 : Cross-Site Scripting (XSS)
app.get('/search', (req, res) => {
  const q = req.query.q;
  res.type("text/plain").send("Connexion réussie pour " + username);
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});