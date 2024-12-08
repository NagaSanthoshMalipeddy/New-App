const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => console.log(`Chat server is on port ${PORT}`));

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();


io.on('connection', onConnected);

function onConnected(socket) {
    socketsConnected.add(socket.id);
    console.log(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', ()=>{
        console.log('Disconnected from server ' + socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });
    socket.on('message', (data)=> {
        console.log('Message received to socket server');
        socket.broadcast.emit('chat-message', data);
    })
    socket.on('typing', (name)=>{
        console.log(name +'is typing...');
        socket.broadcast.emit('typing', name);
    });
}