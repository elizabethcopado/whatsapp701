// archivo: /models/mensajeModel.js
const mongoose = require('./CHAT');

const mensajeSchema = new mongoose.Schema({
    de: String,
    para: String,
    mensaje: String,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mensaje', mensajeSchema);
