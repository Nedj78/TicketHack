var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
  
var app = express();

// CORS pour permettre les appels API
app.use(cors());

// Logger
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Servir les fichiers statiques depuis la RACINE du projet
app.use(express.static(path.join(__dirname, '..')));

// ✅ Servir aussi le dossier public du backend (optionnel)
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/', indexRouter);
app.use('/users', usersRouter);

// ✅ Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
