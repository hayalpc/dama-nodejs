const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const guid = require('./libs/guid');
const lib = require('./libs/functions');

/**
 * Variables
 */
const Clients = lib.clients;
const Functions = lib.functions;

/**
 * Express
 * Express Server
 */
const app = express();
const server = http.createServer(app);

/**
 * Socket Server
 */
const wss = new WebSocket.Server({server});

/**
 * Socket Server Events
 */

wss.on('connection', (socket,req) => {
    socket.id = guid();
    Clients[socket.id] = socket;

    socket.on('message', (rawMessage) => {
        message = JSON.parse(rawMessage);
        if(Functions[message.action] !== undefined) {
            Functions[message.action](message.data, socket);
        }else{
            console.log(message);
        }
    });

    socket.on('close',()=>{
        Functions['close'](socket);
    });

});



/**
 * Express Listener
 */
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server started via ${server.address().address} on port ${server.address().port} :)`);
});