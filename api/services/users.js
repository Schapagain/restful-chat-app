

const path = require('path');
const appRoot = path.dirname(require.main.filename);
const db = require(appRoot.concat('/db'));

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

exports.getUser = getUser;
exports.getUsers = getUsers;
exports.deleteUser = deleteUser