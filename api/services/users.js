

const path = require('path');
const appRoot = path.dirname(require.main.filename);
const db = require(appRoot.concat('/db'));
const serverAddress = 'http://localhost:'.concat(process.env.PORT);


const getUsers = async () => {
    try{
        const queryString = "SELECT * FROM users";
        const queryResult = await db.query(queryString);
        return queryResult.rows;
    }
    catch(err){
        console.log(err);
        return false;
    };
}

const getUser = async username => {

    try{
        const queryString = "SELECT * FROM users WHERE username=$1";
        const queryValues = [username];
        const queryResult = await db.query(queryString,queryValues);
        if (!queryResult.rowCount){
            return false;
        }else{
            const userInfo = queryResult.rows[0];
            return userInfo;
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
};

const deleteUser = async username => {

    try{
        const queryString = "DELETE FROM users WHERE username=$1 RETURNING *";
        const queryValues = [username];
        const queryResult = await db.query(queryString,queryValues);
        if (!queryResult.rowCount){
            return false;
        }else{
            await removeUserLogin(username);
            await removeChatReceived(username);
            return queryResult.rows[0];
        }
    }
    catch(err) {
        console.log(err);
        return false;
    };
};

const removeUserLogin = username => {
    const queryString = "DELETE from login WHERE username=$1";
    const queryValues = [username];
    return db
        .query(queryString,queryValues)
        .catch( err => console.log(err));
}

const removeChatReceived = username => {
    const queryString = "DELETE FROM chats WHERE receiver=$1";
    const queryValues = [username];
    return db
        .query(queryString,queryValues)
        .catch( err => console.log(err));

}

const updateUser = async user => {

    try{
        if(user.profilepicture) {
            user.profilepicture = serverAddress.concat('/uploads/',user.profilepicture);
        }

        const username = user.username;
        delete user.username;

        const propsToUpdate = Object.keys(user);
        const valuesToUpdate = Object.values(user);

        if (propsToUpdate.length < 1) {
            return false;
        }

        for (let i = 0; i < propsToUpdate.length; i++){
            propsToUpdate[i] = propsToUpdate[i].concat('=$',i+2);
        }
        const propsString = propsToUpdate.join(', ');
        const queryString = "update users set ".concat(propsString,' WHERE username=$1 RETURNING *');
        const queryValues = [username].concat(valuesToUpdate);
        const queryResult = await db.query(queryString,queryValues);
        if (!queryResult || !queryResult.rowCount){
            return false;
        }else{
            return queryResult.rows[0];
        }
    }
    catch (err) {
        console.log(err);
        return false;
    };
}

exports.getUser = getUser;
exports.getUsers = getUsers;
exports.deleteUser = deleteUser
exports.updateUser = updateUser;