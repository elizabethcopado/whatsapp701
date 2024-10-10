var socket = io.connect('http://3.22.224.21:5000/');
var persona = document.getElementById('usuario'), // Cambié a 'usuario' para que coincida
    appChat = document.getElementById('app-chat'), // Cambié de 'app-chart' a 'app-chat'
    panelBienvenida = document.getElementById('panel-bienvenida'),
    mensaje = document.getElementById('mensaje'),
    botonEnviar = document.getElementById('enviar'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById('output');

// Evento de clic para enviar mensajes
botonEnviar.addEventListener('click', function () {
    if (mensaje.value) {
        socket.emit('chat', {
            mensaje: mensaje.value,
            usuario: persona.value // Cambié a 'persona' para que coincida
        });
    }
    mensaje.value = ''; // Limpiar el campo de mensaje
});

// Evento para detectar escritura
mensaje.addEventListener('keyup', function () {
    if (persona.value) {
        socket.emit('typing', {
            nombre: persona.value, // Cambié a 'persona' para que coincida
            texto: mensaje.value
        });
    }
});

// Recibir mensaje de chat
socket.on('chat', function (data) {
    escribiendoMensaje.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.usuario + ':</strong> ' + data.mensaje + '</p>';
});

// Recibir notificación de escritura
socket.on('typing', function (data) {
    if (data.texto) {
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje...</em></p>';
    } else {
        escribiendoMensaje.innerHTML = '';
    }
});

// Función para ingresar al chat
function ingresarAlChat() {
    if (persona.value) {
        panelBienvenida.style.display = "none"; // Ocultar panel de bienvenida
        appChat.style.display = "block"; // Mostrar el chat
        var nombreDeUsuario = persona.value;
        persona.value = nombreDeUsuario; // Asignar nombre de usuario
        persona.readOnly = true; // Hacer campo de usuario de solo lectura
    }
}