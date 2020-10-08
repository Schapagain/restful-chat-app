const http = require('http');
const app = require('./app');
const socketio = require('socket.io');

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);
server.listen(port);


// Imports for socket
// Refactor later
const { register_socket } = require('./api/drivers/register');
const { login_socket } = require('./api/drivers/login');


io.on('connection',socket => {
    console.log('Someone connected!');

    socket.on('registration', user => {
        register_socket(socket,user);
    })

    socket.on('login', user => {
        login_socket(socket,user);
    })

})

