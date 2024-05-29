var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');
var mongoose = require('mongoose');
var Personaje = require('../models/personaje'); 
var Marker = require('../models/Marker');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const personajes = await Personaje.find({});
    res.render('index', { title: 'Madrid de Bolsillo', personajes, user: req.user });

  } catch (err) {
    next(err);
  }
});

// Está registrado?
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// LOS PLANES INCLUÍDOS EN JSON APARECERÁN EN EL MAPA DEL FRONTEND
router.get('/', async function(req, res, next) {
  try {
    const markers = await Marker.find({});
    res.render('index', { title: 'Madrid de Bolsillo', markers, user: req.user });
  } catch (err) {
    next(err);
  }
});

// Ruta GET para XML
router.get('/xml', async (req, res, next) => {
  var personajes = await Personaje.find();
    //Pasando a string y luego de nuevo a JSON nos evitamos errores de conversion posteriores con o2x
    personajesFixed = JSON.parse(JSON.stringify(personajes));
    res.set('Content-Type', 'text/xml');
    res.send(o2x({
      '?xml version="1.0" encoding="utf-8"?': null, personajes: { "personaje": personajesFixed }
    }));
});

// Ruta GET para JSON
router.get('/json', async function(req, res, next) {
  try {
    const personajes = await Personaje.find({});
    res.set('Content-Type', 'application/json');
    res.json(personajes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

