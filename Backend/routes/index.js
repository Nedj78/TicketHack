// IMPORTATION MODULE EXPRESS & CREATION D'UN ROUTEUR
var express = require("express");
var router = express.Router();
const { Client } = require('pg'); 

// CONNEXION BASE DE DONNEES POSTGRESQL
let connectionString = process.env.DATABASE_URL;

// Forcer sslmode=require pour Neon.tech
if (!connectionString.includes('sslmode=')) {
    connectionString += '?sslmode=require';
} else if (connectionString.includes('sslmode=verify-full')) {
    connectionString = connectionString.replace('sslmode=verify-full', 'sslmode=require');
}

const client = new Client({ 
    connectionString
}); 

client.connect()
    .then(() => console.log('✅ Connecté à PostgreSQL'))
    .catch(err => console.error('❌ Erreur de connexion:', err));

// ENDPOINT POUR LA RECHERCHE DE BILLETS CORRESPONDANTS A LA RECHERCHE
router.post("/tickets/search", (req, res) => {
  if (!req.body.departure || !req.body.arrival || !req.body.date) {
    res.json({success: false, error: 'Missing data'}) 
    return;
  };

  const { departure, arrival, date } = req.body;

  const query = 'SELECT * FROM tickets WHERE departure ILIKE $1 AND arrival ILIKE $2 AND date::date = $3'; 
  const values = [`${departure}`, `${arrival}`, date]; 

  client.query(query, values)
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
  client.query(query)
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
