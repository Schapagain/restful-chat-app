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
        console.log(user);
        registerDriver(socket,user);
    })

    socket.on('login', user => {
        const token = loginDriver(socket,user);
        if (token){
            userToSocket[user.username] = socket.id;
            socketToUser[socket.id] = user.username;

            // Pass in all other active users on login
            socket.emit('get-online-users-success',activeProfiles)
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

            // Add profile to the list of active users
            activeProfiles[username] = user;

            // Release new user to others
            socket.broadcast.emit('online-update',{
                online: true,
                user
            });

            console.log('active users:',userToSocket,socketToUser,activeProfiles);

        }else{
            socket.disconnect();
        }


    })

    socket.on('chat-message',msg => {
        const username = getUsernameFromToken(msg.userToken);
        console.log('got message from',username);
        if (username){
            delete msg.userToken;
            socket.broadcast.emit('chat-message',msg);
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

// io.of('/chat').on('connection', socket => {

    // const userToken = getTokenFromURL(socket.handshake.headers.referer);
    // const username = getUsernameFromToken(userToken);

    // // Welcome message


    // // Notify others of new connection
    // if (username){
    //     socket.broadcast.emit('broadcast-message',{
    //         message: username.concat(' has joined the chat'),
    //         username: "ChatApp Bot",
    //     })
    // }else{
    //     socket.disconnect();
    // }

//     // Handle other events
//     socket.on('get-user', userToken => {
//         const username = getUsernameFromToken(userToken);
//         console.log('got a request to get user:',username);
//         userDriver.getUser(socket,username);
//     })

//     socket.on('update-user', ({user, userToken}) => {
//         const username = getUsernameFromToken(userToken);
//         user.username = username;
//         userDriver.updateUser(socket,user);
//     })

//     socket.on('chat-message',msg => {
//         const username = getUsernameFromToken(msg.userToken);
//         if (username){
//             delete msg.userToken;
//             msg.username = username;
//             socket.broadcast.emit('chat-message',msg);
//         }
//     })

//     socket.on('disconnect', () => {
//         socket.broadcast.emit('broadcast-message',{
//             message: username.concat(' has left the chat'),
//             username: "ChatApp Bot",
//         })
//     })
// })


 const getTokenFromURL = urlString => {
    const url = new URL(urlString);
    const parameters = new URLSearchParams(url.search);
    const userToken = parameters.get('token');
    return userToken == null? '':userToken;
}
