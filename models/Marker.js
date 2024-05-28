const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
    latlng: {
        lat: Number,
        lng: Number
    },
    title: String,
    info: String,
    image: String,
    category: {
        type: String,
        enum: ['Restauración', 'Viajes', 'Naturaleza', 'Deportes', 'Ocio', 'sin asignar'],
        default: 'sin asignar'
    },
    plan: {
        type: String,
        enum: ['normal', 'gratis'],
        default: 'normal'
    },
    masInfo: String
});

const Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;
