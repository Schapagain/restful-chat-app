const path = require('path');
const appRoot = path.dirname(require.main.filename);
const loginService = require(appRoot.concat('/api/services/login'));

const loginDriver = async (requestOrSocket,responseOrUser) => {
    const isRequest = requestOrSocket.handshake == null
    const user = isRequest? {username: requestOrSocket.body.username, password: requestOrSocket.body.password}:responseOrUser;
    const token = await loginService(user);
    const response = token? {success: true, token,}:{status: false, error:"Not authorized"};
    console.log('emitting..');
    isRequest? responseOrUser.status(200).json(response):requestOrSocket.emit("login-response",response);
}
module.exports = loginDriver;