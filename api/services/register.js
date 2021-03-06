const path = require('path');
const bcrypt = require('bcrypt');
const appRoot = path.dirname(require.main.filename);
const db = require(appRoot.concat('/db'));
const serverAddress = process.env.SERVERADDRESS+process.env.PORT;

const register = async user => {
    try{
        ({ username, password, firstname, lastname } = user);
        if (!username || !password || !firstname || !lastname) {
            return false;
        }

        const returnedUsername = await registerUser({username: user.username, password: user.password})
        const initializedProfile = await initUserProfile({username: user.username, firstname: user.firstname, lastname: user.lastname})
        if (returnedUsername && initializedProfile){
            return returnedUsername;
        }

    }
    catch(err){
        console.log(err);
        return false;
    }
};

const initUserProfile = async user => {
    try{
        const queryString = "INSERT INTO users (username,firstname,lastname,cellnumber,profilepicture) VALUES ($1,$2,$3,$4,$5)";
        const queryValues = [user.username,user.firstname,user.lastname, '', serverAddress.concat('/uploads/dummy.png')];
        const queryResult = await db.query(queryString, queryValues)
        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

const registerUser = async user => {

    try{
        const newUsername = user.username;
        const duplicateExists = await checkforDuplicates(newUsername);
        if (duplicateExists) {
            return false;
        } else {
            const newPasswordHash = await generatePasswordHash(user.password);
            const newUser = { username: newUsername, password: newPasswordHash };
            const addedUser = await addUserCredentials(newUser);
            return addedUser.username;
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
}

const generatePasswordHash = async passwordPlain => {
    try{
        const saltRounds = 5;
        const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);
        return passwordHash;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

const checkforDuplicates = async userName => {
    try{
        const queryString = "SELECT username FROM login WHERE username=$1";
        const queryValues = [userName];
        const queryResult = await db.query(queryString, queryValues)
        const usernameExists = queryResult.rowCount > 0;
        return usernameExists;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

const addUserCredentials = async user => {

    try{
        const queryString = "INSERT INTO login (username,password) VALUES ($1,$2) RETURNING username";
        const queryValues = [user.username, user.password];
        const queryResult = await db.query(queryString, queryValues)
        return queryResult.rows[0];
    }
    catch(err){
        console.log(err);
        return false;
    }
}

module.exports = register;