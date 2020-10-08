const http = require('http');
const app = require('./app');
const socketio = require('socket.io');
const njwt = require('njwt');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);
server.listen(port);

// Imports for socket
// Refactor later
const { register_socket } = require('./api/drivers/register');
const { login_socket } = require('./api/drivers/login');
const { getUser_socket } = require('./api/drivers/users');
const { getUsernameFromToken } = require('./utils/authorization');

io.on('connection',socket => {
    console.log('Someone connected!');

    socket.on('registration', user => {
        register_socket(socket,user);
    })

    socket.on('login', user => {
        login_socket(socket,user);
    })

})

io.of('/chat').on('connection', socket => {

    const userToken = getTokenFromURL(socket.handshake.headers.referer);
    const username = getUsernameFromToken(userToken);

    // Welcome message
    socket.emit('broadcast-message',{
        message: "Welcome to ChatApp, ".concat(username),
    })

    // Notify others of new connection
    if (username){
        socket.broadcast.emit('broadcast-message',{
            message: username.concat(' has joined the chat'),
        })
        getUser_socket(socket,username);
    }

    socket.on('chat-message',msg => {
        const username = getUsernameFromToken(msg.userToken);
        if (username){
            socket.broadcast.emit('chat-message',{username,message:msg.message});
        }
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('broadcast-message',{
            message: username.concat(' has left the chat'),
        })
    })
})


 const getTokenFromURL = urlString => {
    const url = new URL(urlString);
    const parameters = new URLSearchParams(url.search);
    const userToken = parameters.get('token');
    return userToken == null? '':userToken;
}
