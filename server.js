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
const registerDriver = require('./api/drivers/register');
const loginDriver = require('./api/drivers/login');
const { getUsernameFromToken } = require('./utils/authorization');
const userDriver = require('./api/drivers/users');

activeProfiles = {};
userToSocket = {};
socketToUser = {};
io.on('connection',socket => {
    console.log('Someone connected!');

    socket.on('registration', user => {
        registerDriver(socket,user);
    })

    socket.on('login', user => {
        const token = loginDriver(socket,user);
        if (token){
            userToSocket[user.username] = socket.id;
            socketToUser[socket.id] = user.username;

        }
        
    })

    socket.on('get-user-onload',async userToken => {
        const username = getUsernameFromToken(userToken);

        if(username){
            // Welcome message
            socket.emit('broadcast-message',{
                message: "Welcome to ChatApp, ".concat(username),
                firstname: "ChatApp Bot",
            });
            // Notify others of join
            socket.broadcast.emit('broadcast-message',{
                message: username.concat(' has joined the chat'),
                firstname: "ChatApp Bot",
            })

            // Emit user profile to client
            const user = await userDriver.getUser(socket,username);
            
            // Pass in all other active users 
            console.log('emitting active profiles',activeProfiles)
            socket.emit('get-online-users-success',activeProfiles)
            
            // Add profile to the list of active users
            activeProfiles[username] = user;

            // Release new user to others
            socket.broadcast.emit('online-update',{
                online: true,
                user
            });

        }else{
            socket.disconnect();
        }

    })

    socket.on('chat-message',msg => {
        const username = getUsernameFromToken(msg.userToken);
        if (username){
            delete msg.userToken;
            const receiverSocket = userToSocket[msg.receiver];
            io.to(receiverSocket).emit('chat-message',msg);
        }
    })

    socket.on('disconnect', () => {
        const username = socketToUser[socket.id];
        socket.broadcast.emit('broadcast-message',{
            message: username + ' has left the chat',
            username: "ChatApp Bot",
            firstname: "ChatApp Bot",
        })
        delete socketToUser[socket.id];
        delete userToSocket[username];
        delete activeProfiles[username];

        socket.broadcast.emit('online-update',{
            online:false,
            username
        })
    })

})