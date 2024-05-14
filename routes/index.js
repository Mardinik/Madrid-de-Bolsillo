var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');
var mongoose = require('mongoose');
var Personaje = require('../models/personaje'); 

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

// Ruta GET para las páginas de personaje
router.get('/character/:_id', isLoggedIn, async function(req, res, next) {
  try {
    var characterID = req.params._id;
    var personaje = await Personaje.findById(characterID).exec();
    if (personaje) {
      res.render('personaje', { title: 'Página de personaje', personaje: personaje });
    } else {
      var err = new Error('Character Not Found');
      err.status = 404;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

// Crear personaje
router.post('/', async function(req, res, next) { 
  try {
    var nombre = req.body.nombre; 
    var fuerza = req.body.fuerza; 
    var faccion = req.body.faccion; 

    var nuevoPersonaje = new Personaje({
      Nombre: nombre,
      Fuerza: fuerza,
      Faccion: faccion
    });

    await nuevoPersonaje.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// Eliminar personaje
router.post('/character/:ID', async function(req, res, next) { 
  try {
    var characterID = req.params.ID;
    await Personaje.findOneAndDelete({_id: characterID});
    res.redirect('/');
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

