const serverAddress = 'http://localhost:3000';
const socket = io(serverAddress.concat('/chat'));
$('form').submit((e)  => {
    e.preventDefault();
    handleOutgoingChatMsg();
    return false;
});

socket.on('chat-message', msg => {
    handleIncomingChatMsg(msg);
});

socket.on('authorization-failure', result => {
    console.log(result);
})

const handleIncomingChatMsg = (msg) => {
    $('#messages').append($('<li class="other-message">').html(msg.username.concat(' says:','<br/>',msg.message)));
}

const handleOutgoingChatMsg = () => {
    const message = $('#message').val();
    const userToken = getUserToken();
    socket.emit('chat-message',{message,userToken});
    $('#message').val('');
    $('#messages').append($('<li class="own-message">').text(message));
}

const getUserToken = () => {
    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    const userToken = parameters.get('token');
    return userToken == null? '':userToken;
}
