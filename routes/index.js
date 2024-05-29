var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');
var mongoose = require('mongoose');
var Marker = require('../models/Marker');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const markers = await Marker.find({});
    res.render('index', { title: 'Madrid de Bolsillo', markers, user: req.user });
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
  try {
    var markers = await Marker.find();
    // Pasando a string y luego de nuevo a JSON nos evitamos errores de conversión posteriores con o2x
    var markersFixed = JSON.parse(JSON.stringify(markers));
    res.set('Content-Type', 'text/xml');
    res.send(o2x({
      '?xml version="1.0" encoding="utf-8"?': null, markers: { "marker": markersFixed }
    }));
  } catch (err) {
    next(err);
  }
});

// Ruta GET para JSON
router.get('/json', async function(req, res, next) {
  try {
    const markers = await Marker.find({});
    res.set('Content-Type', 'application/json');
    res.json(markers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

