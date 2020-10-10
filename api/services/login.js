const path = require('path');
const appRoot = path.dirname(require.main.filename);
const bcrypt = require('bcrypt');
const {getAuthToken} = require(appRoot.concat('/utils/authorization'));
const db = require(appRoot.concat('/db'));

const login = async user => {
    try{
        ({username,password} = user);
        if (!username || !password){
            return false;
        }
        const userReturned = await getUserCredentials(user);
        if (!userReturned || !userReturned.password){
            return false;
        }
        const passwordMatch = await validatePassword(userReturned.password,user.password);
        if (passwordMatch){
            const token = await getAuthToken(userReturned.username);
            return token;
        }else{
            return false;
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
};

const validatePassword = (passwordHash,passwordPlain) => bcrypt.compare(passwordPlain,passwordHash);

const getUserCredentials = async user => {
    try{
        const queryString = 'SELECT password FROM login WHERE username=$1';
        const queryValues = [user.username];
        const queryResult = await db.query(queryString,queryValues);
        const userFound = queryResult.rows.length > 0;
        return {username:username, password: userFound? queryResult.rows[0].password : null}
    }
    catch(err) {
        console.log(err.message);
        return false;
    }
}

module.exports = login;