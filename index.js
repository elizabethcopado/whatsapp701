var express=require('express');
var socket=require('socket.io');
var app=express();
//servidor para escuchar las peticiones
var server=app.listen(5000,function(){
    console.log("Servidor activo en el puerto 5000");
});
//indicar que use una ubicacion para los archivos de la vista 
app.use(express.static('public'));

var io = socket(server);
io.on('connection', function (socket) {
    console.log('Hay una conexion', socket.id);
    socket.on('chat', function (data) {
        console.log(data);
        io.sockets.emit('chat', data);
    });
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });
});