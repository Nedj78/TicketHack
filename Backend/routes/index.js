// IMPORTATION MODULE EXPRESS & CREATION D'UN ROUTEUR
var express = require("express");
var router = express.Router();
const { Client } = require('pg'); 

// CONNEXION BASE DE DONNEES POSTGRESQL
const connectionString = 'postgres://xvohvzrd:pt_YcASby_XDuIZQUqnnyh4Es3WLV4rl@tai.db.elephantsql.com/xvohvzrd';
const client = new Client({ connectionString }); 
client.connect(); 

// ENDPOINT POUR LA RECHERCHE DE BILLETS CORRESPONDANTS A LA RECHERCHE
router.post("/tickets/search", (req, res) => {
  if (!req.body.departure || !req.body.arrival || !req.body.date) {
    res.json({success: false, error: 'Missing data'}) 
    return;
  };

  const { departure, arrival, date } = req.body; // Extraction des données de la requête par méthode de destructuration de la requête

  // Déclarer la requête SQL 
  const query = 'SELECT * FROM tickets WHERE departure ILIKE $1 AND arrival ILIKE $2 AND date::date = $3'; 
  const values = [`${departure}`, `${arrival}`, date]; 

  // Exécution de la requête SQL
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