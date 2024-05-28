const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Ruta para guardar marcadores
router.post('/saveMarkers', (req, res) => {
  if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  User.findById(req.user._id, (err, user) => {
      if (err) return res.status(500).json({ error: err });
      
      // Guarda los marcadores del cuerpo de la solicitud en el campo 'markers' del usuario
      user.markers = req.body.markers;
      
      user.save((err) => {
          if (err) return res.status(500).json({ error: err });
          res.status(200).json({ success: true });
      });
  });
});

// Ruta para cargar marcadores
router.get('/loadMarkers', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    User.findById(req.user._id, (err, user) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ markers: user.markers });
    });
});

// MARCADORES DEL USUARIO

// Ruta para guardar marcadores
router.post('/save', async function(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const { markers } = req.body;
    try {
      await User.findByIdAndUpdate(req.user._id, { markers });
      res.status(200).json({ message: 'Marcadores guardados con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al guardar los marcadores', error });
    }
  });
  
  // Ruta para obtener marcadores del usuario
  router.get('/load', async function(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    try {
      const user = await User.findById(req.user._id).select('markers');
      res.status(200).json(user.markers);
    } catch (error) {
      res.status(500).json({ message: 'Error al cargar los marcadores', error });
    }
  });

module.exports = router;

