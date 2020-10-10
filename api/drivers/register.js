const path = require('path');
const appRoot = path.dirname(require.main.filename);
const registerService = require(appRoot.concat('/api/services/register'));

const registerDriver = async (requestOrSocket,responseOrUser) => {
    const isRequest = requestOrSocket.handshake == null
    const user = isRequest? {username: requestOrSocket.body.username, password: requestOrSocket.body.password}:responseOrUser;
    const registeredUser = await registerUser({ username, password })
    const response = registeredUser? {success: true, registeredUser,}:{success:false, error:"Could not add user"}; 
    isRequest? responseOrUser.status(200).json(response):requestOrSocket.emit("registration-response",response); 
};
module.exports = registerDriver;