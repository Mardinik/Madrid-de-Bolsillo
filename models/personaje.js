var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PersonajeSchema = new Schema({
    Nombre: {type: String, required: true, max: 100},
    Fuerza: {type: Number, required: true, min: 0, max: 100},
    Faccion: {type: String, required: false, max: 100},
});

module.exports = mongoose.model('Personaje', PersonajeSchema);

