const path = require('path');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const njwt = require('njwt');
// Database connection
const appRoot = path.dirname(require.main.filename);
const db = require(appRoot.concat('/db'));

router.post('/',(req,res,next) => {
    ({username,password} = req.body);
    if (!username || !password){
        throw new Error("Username and password are required");
    }

    getUserCredentials({username,password})
    .then( user => {

        if (!user || !user.password){
            throw new Error('Invalid credentials');
        }
        validatePassword(user.password,password)
        .then( passwordMatch => {
            if (passwordMatch){
                const token = getAuthToken(user.username);
                res.status(200).json({
                message: "Authorized",
                token,
                })
            }else{
                next(new Error("Invalid credentials"));
            }
        })
        .catch( err => {
            console.log(err);
            throw err;    
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "Authorization not successfull",
        })
    }); 
});

const validatePassword = (passwordHash,passwordPlain) => bcrypt.compare(passwordPlain,passwordHash);

const getUserCredentials = user => {
    const username = user.username;
    return db
        .query(`SELECT password FROM login WHERE username='${username}'`)
        .then( (res) => {
            const userFound = res.rows.length > 0;
            return {username:username, password: userFound? res.rows[0].password : null}
            })
        .catch ( err => console.log(err.message))
}

const getAuthToken = username => {
    const claims = {
      sub: username,
    }
    const token = njwt.create(claims,process.env.PRIVATEKEY);
    return token.compact();
}
module.exports = router;