const path = require('path');
const appRoot = path.dirname(require.main.filename);
const chatService = require(appRoot.concat('/api/services/chats'));

const addChat = (socket,chat) => {

}

const getChat = (socket,chat) => {

}

exports.addChat = addChat;
exports.getChat = getChat;