var express = require('express');
var socket = require('socket.io');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); // Importar bcrypt para el manejo de contraseñas
var app = express();

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://AlexanderMartinez:MABJ030923HMCRNNA5@ejercicio.32n5k.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Definición de los esquemas y modelos
var userSchema = new mongoose.Schema({
    nombre: String,
    contraseña: String
});

var User = mongoose.model('User', userSchema);

var messageSchema = new mongoose.Schema({
    usuario: String,
    mensaje: String,
    timestamp: { type: Date, default: Date.now }
});

var Message = mongoose.model('Message', messageSchema);

// Configuración del servidor
var server = app.listen(5000, function() {
    console.log("Servidor activo en el puerto 5000");
});
app.use(express.static('public'));
var io = socket(server);

// Almacena los usuarios conectados
const connectedUsers = {};

io.on('connection', function(socket) {
    console.log('Hay una conexión:', socket.id);

    // Registro de nuevo usuario
    socket.on('register', function(data) {
        const { nombre, contraseña } = data;

        // Verificar si el usuario ya existe
        User.findOne({ nombre })
            .then(existingUser => {
                if (existingUser) {
                    socket.emit('registerError', { mensaje: 'El nombre de usuario ya está en uso.' });
                } else {
                    // Hashear la contraseña y guardar el nuevo usuario
                    const hashedPassword = bcrypt.hashSync(contraseña, 10);
                    const newUser = new User({ nombre, contraseña: hashedPassword });
                    newUser.save()
                        .then(() => {
                            socket.emit('registerSuccess', { mensaje: 'Registro exitoso. Puedes iniciar sesión ahora.' });
                        })
                        .catch(err => {
                            console.error("Error al registrar el usuario:", err);
                            socket.emit('registerError', { mensaje: 'Error al registrar el usuario.' });
                        });
                }
            })
            .catch(err => console.error("Error al buscar el usuario:", err));
    });

    // Iniciar sesión
    socket.on('login', function(data) {
        const { nombre, contraseña } = data;
        User.findOne({ nombre })
            .then(user => {
                if (user && bcrypt.compareSync(contraseña, user.contraseña)) { // Verificar la contraseña
                    console.log(`Usuario ${nombre} inició sesión`);

                    // Almacenar el usuario conectado
                    connectedUsers[socket.id] = user.nombre;

                    // Emitir todos los mensajes al usuario que inicia sesión
                    Message.find().then(messages => {
                        socket.emit('allMessages', messages);
                    });

                    // Emitir un mensaje de éxito de inicio de sesión
                    socket.emit('loginSuccess', { nombre }); // Enviar nombre de usuario
                } else {
                    socket.emit('loginError', { mensaje: 'Nombre de usuario o contraseña incorrectos.' });
                }
            })
            .catch(err => console.error("Error al iniciar sesión:", err));
    });

    // Manejo de mensajes del chat
    socket.on('chat', function(data) {
        // Verificar si el usuario está autenticado
        if (connectedUsers[socket.id]) {
            const nuevoMensaje = new Message({
                usuario: connectedUsers[socket.id],
                mensaje: data.mensaje
            });

            // Guardar el mensaje en la base de datos
            nuevoMensaje.save()
                .then(() => {
                    io.sockets.emit('chat', {
                        usuario: connectedUsers[socket.id],
                        mensaje: data.mensaje
                    }); // Emitir mensaje a todos los clientes
                })
                .catch(err => console.error("Error al guardar el mensaje:", err));
        } else {
            socket.emit('error', { mensaje: 'No tienes permiso para enviar mensajes.' });
        }
    });

    // Manejo de eventos de escritura
    socket.on('typing', function(data) {
        if (connectedUsers[socket.id]) {
            socket.broadcast.emit('typing', data);
        }
    });

    // Manejo de desconexión
    socket.on('disconnect', function() {
        // Eliminar usuario desconectado
        delete connectedUsers[socket.id];
        console.log('Usuario desconectado:', socket.id);
    });
});