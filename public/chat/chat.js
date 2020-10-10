const serverAddress = 'http://localhost:3000';
const socket = io(serverAddress.concat('/chat'));
$('form').submit((e)  => {
    e.preventDefault();
    handleOutgoingChatMsg();
    return false;
});

$('#image').change( e => {
    e.preventDefault();
    console.log('uploaded an image');
    handleOutgoingImage();
    return false;
})

socket.on('broadcast-message',msg => {
    handleBroadcastMsg(msg);
})

socket.on('chat-message', msg => {
    handleIncomingChatMsg(msg);
});

socket.on('authorization-failure', result => {
    console.log(result);
})

const handleIncomingChatMsg = msg => {

    if (msg.image) {
        const messageDiv = $('<div class="other-message">');
        let metaMesage = $('<div class = "meta-message">').text(msg.username.concat(' ',getCurrentTime())); 
        const newImage = $('<img>');
        newImage.attr('src',msg.image);
        $('#messages').append(messageDiv.append(metaMesage,newImage));
        newImage[0].scrollIntoView();
    }
    if (msg.message) {
        messageDiv = $('<div class = "other-message">');
        metaMesage = $('<div class = "meta-message">').text(msg.username.concat(' ',getCurrentTime()));
        const textmessage = $('<div class = "message">').text(msg.message);
        $('#messages').append(messageDiv.append(metaMesage,textmessage));
        textmessage[0].scrollIntoView();
    }
    
}

const handleOutgoingChatMsg = () => {
    const message = $('#message').val();
    const userToken = getUserToken();
    socket.emit('chat-message',{message,userToken});
    $('#message').val('');

    const messageDiv = $('<div class = "own-message">');
    const metaMesage = $('<div class = "meta-message">').text(getCurrentTime());
    const textmessage = $('<div class = "message">').text(message);
    
    // Add ownmessage to the chat-box
    $('#messages').append(messageDiv.append(metaMesage,textmessage));
    messageDiv[0].scrollIntoView();
}

const handleOutgoingImage = () => {
    const img = $('#image').prop('files')[0];
    $("#image").replaceWith($("#image").val('').clone(true));

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        const base64String = fileReader.result;
        const userToken = getUserToken();
        socket.emit('chat-message',{
            image: base64String,
            userToken,
        });
        const messageDiv = $('<div class = "own-message">');
        const metaMesage = $('<div class = "meta-message">').text(getCurrentTime());
        const newImage = $('<img>').attr('src',base64String);
        
        // Add own image to the chat-box
        $('#messages').append(messageDiv.append(metaMesage,newImage));
        messageDiv[0].scrollIntoView();

    }
    fileReader.readAsDataURL(img);

}

const handleBroadcastMsg = msg => {
    messageDiv = $('<div class = "broadcast-message">');
    metaMesage = $('<div class = "meta-message">').text(msg.username.concat(' ',getCurrentTime()));
    const textmessage = $('<div class = "message">').text(msg.message);
    $('#messages').append(messageDiv.append(metaMesage,textmessage)); 
    messageDiv[0].scrollIntoView();
}

const getUserToken = () => {
    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    const userToken = parameters.get('token');
    return userToken == null? '':userToken;
}

const getCurrentTime = () => new Date().toLocaleTimeString();

const getUserProfile = userToken => {
    socket.emit('get-user', userToken);
};

// Load user profile
getUserProfile(getUserToken());

socket.on('get-user-response', user => {
    if (user.success){
        const profilePicture = user.user.profilepicture;
        $('#profile-pic').attr('src',profilePicture);
    }
})

