// IMPORTATION MODULE EXPRESS & CREATION D'UN ROUTEUR
var express = require("express");
var router = express.Router();
const { Pool } = require('pg');  // ← Utiliser Pool au lieu de Client

// CONNEXION BASE DE DONNEES POSTGRESQL
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    },
    // Paramètres spécifiques pour Neon.tech
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
});

// Test de connexion au démarrage
pool.connect()
    .then(client => {
        console.log('✅ Connecté à PostgreSQL');
        client.release();
    })
    .catch(err => console.error('❌ Erreur de connexion:', err));

// ENDPOINT POUR LA RECHERCHE DE BILLETS
router.post("/tickets/search", (req, res) => {
  if (!req.body.departure || !req.body.arrival || !req.body.date) {
    res.json({success: false, error: 'Missing data'}) 
    return;
  };

  const { departure, arrival, date } = req.body;

  const query = 'SELECT * FROM tickets WHERE departure ILIKE $1 AND arrival ILIKE $2 AND date::date = $3'; 
  const values = [`${departure}`, `${arrival}`, date]; 

  pool.query(query, values)  // ← pool.query au lieu de client.query
      .then(data => {
          if (data.rows.length) {
              res.json({ success: true, tickets: data.rows }); 
          } else {
              res.status(404).json({ success: false, error: "No tickets found" }); 
          }
      })
      .catch(error => {
          console.error(error);
          res.status(500).json({ success: false, error: "Failed to retrieve tickets data" }); 
      });
});

// ENDPOINT POUR RECUPERER TOUS LES BILLETS
router.get('/tickets', (req, res) => {
  const query = 'SELECT * FROM tickets'; 
  pool.query(query)  // ← pool.query au lieu de client.query
    .then(data => {
      if (data.rows.length > 0) {
        res.json({ success: true, tickets: data.rows });
      } else {
        res.status(404).json({ success: false, error: 'No tickets found' }); 
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to retrieve tickets data' }); 
    });
});

module.exports = router;
