// Demonstration pedagogique : fichier volontairement vulnerable.
// Ne pas deployer ni importer dans l'application principale.

const express = require("express");
const app = express();

app.get("/demo-xss", (req, res) => {
  // SOURCE : donnee controlee par l'utilisateur.
  const message = req.query.message;

  // FAILLE XSS : insertion directe dans une reponse HTML.
  res.send(`<h1>Message reçu : ${message}</h1>`);
});

// Aucun serveur n'est demarre par ce fichier.
module.exports = app;