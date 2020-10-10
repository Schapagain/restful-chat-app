const http = require('http');
const app = require('./app');
const socketio = require('socket.io');
const njwt = require('njwt');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);
server.listen(port);


const fs = require('fs');


// Imports for socket
// Refactor later
const registerDriver = require('./api/drivers/register');
const loginDriver = require('./api/drivers/login');
const { getUsernameFromToken } = require('./utils/authorization');
const userDriver = require('./api/drivers/users');

io.on('connection',socket => {
    console.log('Someone connected!');

    socket.on('registration', user => {
        registerDriver(socket,user);
    })

    socket.on('login', user => {
        console.log('loggin user')
        loginDriver(socket,user);
    })

})

io.of('/chat').on('connection', socket => {

    const userToken = getTokenFromURL(socket.handshake.headers.referer);
    const username = getUsernameFromToken(userToken);

    // Welcome message
    socket.emit('broadcast-message',{
        message: "Welcome to ChatApp, ".concat(username),
        username: "ChatApp Bot",
    })

    // Notify others of new connection
    if (username){
        socket.broadcast.emit('broadcast-message',{
            message: username.concat(' has joined the chat'),
            username: "ChatApp Bot",
        })
    }else{
        socket.disconnect();
    }

    // Handle other events
    socket.on('get-user', userToken => {
        const username = getUsernameFromToken(userToken);
        console.log('got a request to get user:',username);
        userDriver.getUser(socket,username);
    })

    socket.on('chat-message',msg => {
        const username = getUsernameFromToken(msg.userToken);
        if (username){
            delete msg.userToken;
            msg.username = username;
            socket.broadcast.emit('chat-message',msg);
        }
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('broadcast-message',{
            message: username.concat(' has left the chat'),
            username: "ChatApp Bot",
        })
    })
})


 const getTokenFromURL = urlString => {
    const url = new URL(urlString);
    const parameters = new URLSearchParams(url.search);
    const userToken = parameters.get('token');
    return userToken == null? '':userToken;
}
