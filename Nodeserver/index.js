// Import required modules and create an Express app
const io = require('socket.io')(8000, {
    cors: {
        origin: "*"
    }
});
const express = require("express");
const app = express();
const cors = require("cors");

// Enable CORS for your Express app
app.use(cors());

// Store connected users in an object
const users = {};

// Handle socket.io connections
io.on('connection', socket => {
    // When a new user joins
    socket.on('new-user-joined', uname => {
        // Store the user's socket ID and username
        users[socket.id] = uname;
        // Broadcast to all connected clients that a new user has joined
        socket.broadcast.emit('user-joined', uname);
    });

    // When a user sends a message
    socket.on('send', message => {
        // Broadcast the received message to all connected clients
        socket.broadcast.emit('receive', {
            message: message,
            uname: users[socket.id]
        });
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        // Broadcast to all connected clients that a user has left
        socket.broadcast.emit('left', users[socket.id]);
        // Remove the user from the users object
        delete users[socket.id];
    });
});
