

const path = require('path');
const appRoot = path.dirname(require.main.filename);

const usersService = require(appRoot.concat('/api/services/users'));

const getUsers = async (requestOrSocket,res) => {
    try{
        const isRequest = requestOrSocket.handshake == null
        const users = await usersService.getUsers();
        const response = users? {success: true, users,}:{success:false, error:"Couldn't fetch all users"}; 
        isRequest? res.status(200).json(response):requestOrSocket.emit("get-users-response",response); 
    }
    catch(err){
        console.log(err);
    }
};

const getUser = async (requestOrSocket,responseOrUsername) => {
    try{
        const isRequest = requestOrSocket.handshake == null
        const username = isRequest? requestOrSocket.params.username:responseOrUsername;
        const user = await usersService.getUser(username);
        const response = user? {success: true, user,}:{success:false, error:"User could not be fetched"}; 
        isRequest? responseOrUsername.status(200).json(response):requestOrSocket.emit("get-user-response",response); 
        return user;
    }
    catch(err){
        console.log(err);
    }
};

const deleteUser = async (requestOrSocket,responseOrUsername) => {
    try{
        const isRequest = requestOrSocket.handshake == null
        const username = isRequest? requestOrSocket.params.username:responseOrUsername;
        const user = await usersService.deleteUser(username);
        const response = user? {success: true, user}:{success: false, error:"User could not be deleted"}; 
        isRequest? responseOrUsername.status(200).json(response):requestOrSocket.emit("delete-user-response",response); 
    }
    catch(err){
        console.log(err);
    }
}

const updateUser = async (requestOrSocket,responseOrUser) => {
    try{
        const isRequest = requestOrSocket.handshake == null
        let user = {};
        if (isRequest){
            if (requestOrSocket.file){
                user.profilepicture = requestOrSocket.file.path.split('/uploads/').pop();
            }
            user.username = requestOrSocket.params.username;
            Object.keys(requestOrSocket.body).forEach( key => {
                user[key] = requestOrSocket.body[key];
            })
        }else{
            user = responseOrUser;
        }

        const updatedUser = await usersService.updateUser(user);
        const response = updatedUser? {success: true, updatedUser}:{success: false, error:"User could not be updated"}; 
        isRequest? responseOrUser.status(200).json(response):requestOrSocket.emit("update-user-response",response); 
    }
    catch(err){
        console.log(err);
    }
}

exports.getUser = getUser;
exports.getUsers = getUsers;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;