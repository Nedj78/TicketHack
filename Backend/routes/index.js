// IMPORTATION MODULE EXPRESS & CREATION D'UN ROUTEUR
var express = require("express");
var router = express.Router();
const { Client } = require('pg'); // Importation de la classe Client du module pg pour la connexion à la base de données PostgreSQL

// CONNEXION BASE DE DONNEES POSTGRESQL
const connectionString = 'postgres://xvohvzrd:pt_YcASby_XDuIZQUqnnyh4Es3WLV4rl@tai.db.elephantsql.com/xvohvzrd';
const client = new Client({ connectionString }); // Création d'une nouvelle instance de Client avec la chaîne de connexion
client.connect(); 

// ENDPOINT POUR LA RECHERCHE DE BILLETS CORRESPONDANTS A LA RECHERCHE
router.post("/tickets/search", (req, res) => {
  // Vérification de la présence des données requises dans le corps de la requête
  if (!req.body.departure || !req.body.arrival || !req.body.date) {
    res.json({success: false, error: 'Missing data'}) 
    return;
  };

  const { departure, arrival, date } = req.body; // Extraction des données de la requête par méthode de destructuration de la requête

  // Déclarer les requêtes SQL pour récupérer les enregistrements de billets correspondants aux colonnes de départ, d'arrivée et de date et séparation des données de la requête pour la sécurité.
  const query = 'SELECT * FROM tickets WHERE departure ILIKE $1 AND arrival ILIKE $2 AND date::date = $3'; 
  const values = [`${departure}`, `${arrival}`, date]; 

  // Exécution de la requête SQL
  client.query(query, values)
      .then(data => {
          if (data.rows.length) {
              res.json({ success: true, tickets: data.rows }); // Réponse JSON contenant les billets trouvés
          } else {
              res.status(404).json({ success: false, error: "No tickets found" }); // Réponse JSON en cas de billets non trouvés
          }
      })
      .catch(error => {
          console.error(error);
          res.status(500).json({ success: false, error: "Failed to retrieve tickets data" }); // Réponse JSON en cas d'erreur lors de la récupération des billets
      });
});

// ENDPOINT POUR RECUPERER TOUS LES BILLETS
router.get('/tickets', (req, res) => {
  const query = 'SELECT * FROM tickets'; // Requête SQL pour récupérer tous les enregistrements de billets présents dans la table tickets
  client.query(query)
    .then(data => {
      if (data.rows.length > 0) {
        res.json({ success: true, tickets: data.rows }); // Réponse JSON contenant tous les billets trouvés
      } else {
        res.status(404).json({ success: false, error: 'No tickets found' }); // Réponse JSON en cas de billets non trouvés
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to retrieve tickets data' }); // Réponse JSON en cas d'erreur lors de la récupération des billets
    });
});

module.exports = router; // Exportation du routeur
