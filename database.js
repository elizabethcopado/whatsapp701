// archivo: mensajes.db
const mongoose = require('mongoose');

// Reemplaza 'tu_uri_de_conexion' por la URI de conexión a tu base de datos.
const uri = 'mongodb+srv://yesseniaelizcopado:30121995thv29@yessenia.ui9nr.mongodb.net/CHAT?retryWrites=true&w=majority&appName=Yessenia';

mongoose.connect(uri)
.then(() => console.log('Conexión exitosa a la base de datos'))
.catch(err => console.error('Error de conexión a la base de datos:', err));

module.exports = mongoose;
