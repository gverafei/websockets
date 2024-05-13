const express = require("express")
const { createServer } = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv")

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

dotenv.config()
app.use(express.static("wwwroot"))

// Guarda los usuarios
const users = {}

// Aqui inicia el servidor a abrir sockets
io.on('connection', (socket) => {
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
});

// Escuchamos conexiones
httpServer.listen(process.env.SERVER_PORT, () => {
    console.log(`Servidor de WebSockets escuchando en el puerto ${process.env.SERVER_PORT}`)
})