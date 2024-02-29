var express = require("express");
var router = express.Router();
const { Client } = require('pg');

const connectionString = 'postgres://xvohvzrd:pt_YcASby_XDuIZQUqnnyh4Es3WLV4rl@tai.db.elephantsql.com/xvohvzrd';
const client = new Client({ connectionString });
client.connect();

router.get("/tickets", (req, res) => {
  const { departure, arrival, date } = req.query;

  let query = 'SELECT * FROM tickets';
  let params = [];

  if (departure) {
    query += ' AND departure ILIKE $1';
    params.push(`%${departure}%`);
  }

  if (arrival) {
    query += ' AND arrival ILIKE $2';
    params.push(`%${arrival}%`);
  }

  if (date) {
    query += ' AND date::date = $3';
    params.push(date);
  }

  client.query(query, params)
    .then(data => {
      if (data.rows.length) {
        res.json({ data: true, tickets: data.rows });
      } else {
        res.status(404).json({ data: false, error: "Tickets not found" });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ data: false, error: "Failed to retrieve tickets data" });
    });
});

router.post("/tickets/search", (req, res) => {
  if (!req.body.departure || !req.body.arrival || !req.body.date) {
    res.json({success: false, error: 'Missing data'})
    return;
  };

  const { departure, arrival, date } = req.body;
  console.log(date)

  const query = 'SELECT * FROM tickets WHERE departure ILIKE $1 AND arrival ILIKE $2 AND date::date = $3'; 
  const values = [`%${departure}%`, `%${arrival}%`, date];

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

module.exports = router;
