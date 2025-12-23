const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow frontend to connect

const server = http.createServer(app); //
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`); //

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        // BROADCAST: Sends to everyone EXCEPT the sender
        socket.broadcast.emit('chat message', msg);
    });

    // Listen for typing status
    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('typing', isTyping);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected'); //
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});