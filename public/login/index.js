

const serverAddress = 'http://localhost:3000';
const socket = io(serverAddress);

$('form').submit((e)  => {
    e.preventDefault();

    const attemptingToLogin = $('#login').html() == "Login";
    const username = $('#username').val();
    const password = $('#password').val();
    const user = {username: username, password: password}; 
    if (attemptingToLogin) { handleSigninAttempt(user);}
    else { handleRegistration(user);}
    return false;
});

$('#toggleLoginRegistration').click( (e) => {
    e.preventDefault();
    togglePanel();
});

const handleSigninAttempt = (user) => {
    socket.emit('login',user);
}

const handleRegistration = (user) => {
    socket.emit('registration',user);
}

const togglePanel = () => {
    const register = $('#login').html() == "Login"; 
    $('#username').attr("placeholder",`${register? 'Pick a':'Enter your'} Username`).val('');
    $('#password').attr("placeholder",`${register? 'Pick a':'Enter your'} Password`).val('');
    $('#login').html(`${register? 'Register':'Login'}`);
    $('#toggleLoginRegistration').html(`${register? 'Alredy':'Not'} a user? ${register? 'Log In':'Register'} here`)
}

socket.on('login-response', result => {

    if (result.success){
        window.location = 'http://localhost:3000/'.concat(result.token,'?token=',result.token);
    }else{
        $('#error').html(result.error);
        $('input').addClass('error-border');
    }
    
});

socket.on('registration-success', result => {
    console.log(result);
});

socket.on('registration-failure', result => {
    console.log(result);
})