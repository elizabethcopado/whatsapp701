// archivo: /models/usuarioModel.js
const mongoose = require('./CHAT');

const usuarioSchema = new mongoose.Schema({
    nombreUsuario: String,
    contraseña: String
});

module.exports = mongoose.model('Usuario', usuarioSchema);
