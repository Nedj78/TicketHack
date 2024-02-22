var express = require("express");
var router = express.Router();
const { Client } = require('pg');

const connectionString = 'postgres://xvohvzrd:pt_YcASby_XDuIZQUqnnyh4Es3WLV4rl@tai.db.elephantsql.com/xvohvzrd';
const client = new Client({ connectionString });
client.connect();

router.get("/tickets", (req, res) => {
    client.query('SELECT * FROM tickets')
      .then(data => {
        res.json({ tickets: data.rows });
      })
      .catch(error => {
        console.error(error);
        res.json({ error: "Failed to retrieve tickets data" });
      });
  });

module.exports = router;
