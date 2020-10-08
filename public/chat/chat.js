const serverAddress = 'http://localhost:3000';
const socket = io(serverAddress.concat('/chat'));
$('form').submit((e)  => {
    e.preventDefault();
    handleOutgoingChatMsg();
    return false;
});

socket.on('broadcast-message',msg => {
    handleBroadcastMsg(msg);
})

socket.on('chat-message', msg => {
    handleIncomingChatMsg(msg);
});

socket.on('authorization-failure', result => {
    console.log(result);
})

const handleIncomingChatMsg = (msg) => {

    const messageDiv = $('<li class = "other-message">');
    const metaMesage = $('<div class = "meta-message">').text(msg.username.concat(' ',getCurrentTime()));
    const textmessage = $('<div class = "message">').text(msg.message);
    $('#messages').append(messageDiv.append(metaMesage,textmessage));
}

const handleOutgoingChatMsg = () => {
    const message = $('#message').val();
    const userToken = getUserToken();
    socket.emit('chat-message',{message,userToken});
    $('#message').val('');

    const messageDiv = $('<li class = "own-message">');
    const metaMesage = $('<div class = "meta-message">').text(getCurrentTime());
    const textmessage = $('<div class = "message">').text(message);
    
    // Add ownmessage to the chat-box
    $('#messages').append(messageDiv.append(metaMesage,textmessage));
}

const handleBroadcastMsg = msg => {
    $('#messages').append($('<div class="broadcast-message">').text(msg.message));
}

const getUserToken = () => {
    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    const userToken = parameters.get('token');
    return userToken == null? '':userToken;
}

const getCurrentTime = () => new Date().toLocaleTimeString();